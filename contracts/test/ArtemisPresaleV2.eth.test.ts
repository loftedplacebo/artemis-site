import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixtureV2, MIN_PURCHASE_USD, MAX_PRICE_FEED_AGE } from "./helpers";

describe("ArtemisPresaleV2 ETH purchases", function () {
  it("stores Chainlink feed configuration", async function () {
    const { presale, ethUsdFeed } = await deployFixtureV2();

    expect(await presale.ethUsdPriceFeed()).to.equal(await ethUsdFeed.getAddress());
    expect(await presale.maxPriceFeedAge()).to.equal(MAX_PRICE_FEED_AGE);
    expect(await presale.getEthUsdPrice()).to.equal(ethers.parseUnits("2500", 6));
  });

  it("quotes ETH using the Chainlink ETH/USD feed", async function () {
    const { presale } = await deployFixtureV2();

    const ethAmount = ethers.parseEther("0.04");
    expect(await presale.quoteEthUsdValue(ethAmount)).to.equal(ethers.parseUnits("100", 6));

    const quote = await presale.quoteForETH(ethAmount);
    expect(quote.usdUsed).to.equal(ethers.parseUnits("100", 6));
    expect(quote.tokensAllocated).to.equal(ethers.parseUnits("400", 18));
  });

  it("keeps the full USD value when ETH pricing leaves rounding dust", async function () {
    const batchCaps = [ethers.parseUnits("1000000", 18)];
    const batchPrices = [ethers.parseUnits("0.55", 6)];
    const { buyer1, presale } = await deployFixtureV2({
      batchCaps,
      batchPrices,
      presaleCap: batchCaps[0],
    });

    await presale.setSaleActive(true);

    const ethAmount = ethers.parseEther("0.010001");
    const expectedUsdValue = ethers.parseUnits("25.0025", 6);
    const quote = await presale.quoteForETH(ethAmount);

    expect(quote.usdUsed).to.equal(expectedUsdValue);
    await expect(presale.connect(buyer1).buyWithETH({ value: ethAmount })).to.emit(
      presale,
      "TokensPurchased"
    );
  });

  it("buys with ETH and records dashboard allocation", async function () {
    const { buyer1, presale } = await deployFixtureV2();

    await presale.setSaleActive(true);

    const ethAmount = ethers.parseEther("0.04");
    await expect(presale.connect(buyer1).buyWithETH({ value: ethAmount })).to.emit(
      presale,
      "TokensPurchased"
    );

    const dashboard = await presale.getBuyerDashboard(buyer1.address);
    expect(dashboard.totalUsdSpent).to.equal(ethers.parseUnits("100", 6));
    expect(dashboard.totalTokensAllocated).to.equal(ethers.parseUnits("400", 18));
    expect(dashboard.claimableAmount).to.equal(ethers.parseUnits("400", 18));
    expect(dashboard.purchaseCount).to.equal(1n);
    expect(await presale.totalEthRaised()).to.equal(ethAmount);

    const purchase = await presale.getPurchase(1);
    expect(purchase.paymentToken).to.equal(ethers.ZeroAddress);
    expect(purchase.paymentAmount).to.equal(ethAmount);
  });

  it("supports stablecoin and ETH purchases in the same dashboard", async function () {
    const { buyer1, presale, usdt } = await deployFixtureV2();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") });

    const dashboard = await presale.getBuyerDashboard(buyer1.address);
    expect(dashboard.totalUsdSpent).to.equal(ethers.parseUnits("125", 6));
    expect(dashboard.totalTokensAllocated).to.equal(ethers.parseUnits("500", 18));
    expect(dashboard.purchaseCount).to.equal(2n);
  });

  it("blocks ETH buys below the USD minimum", async function () {
    const { buyer1, presale } = await deployFixtureV2();

    await presale.setSaleActive(true);
    await expect(
      presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Below minimum purchase");
  });

  it("rejects direct ETH transfers", async function () {
    const { buyer1, presale } = await deployFixtureV2();

    await expect(
      buyer1.sendTransaction({ to: await presale.getAddress(), value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Use buyWithETH");
  });

  it("rejects stale ETH/USD feed prices", async function () {
    const { buyer1, presale, ethUsdFeed } = await deployFixtureV2();

    await presale.setSaleActive(true);
    const now = (await ethers.provider.getBlock("latest"))?.timestamp || 0;
    await ethUsdFeed.updateAnswerWithTimestamp(2500n * 100000000n, now - Number(MAX_PRICE_FEED_AGE) - 1);

    await expect(
      presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") })
    ).to.be.revertedWith("Stale ETH/USD price");
  });

  it("rejects invalid ETH/USD feed prices", async function () {
    const { buyer1, presale, ethUsdFeed } = await deployFixtureV2();

    await presale.setSaleActive(true);
    await ethUsdFeed.updateAnswer(0);

    await expect(
      presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") })
    ).to.be.revertedWith("Invalid ETH/USD price");
  });

  it("lets owner update max feed age", async function () {
    const { buyer1, presale } = await deployFixtureV2();

    await expect(presale.connect(buyer1).setMaxPriceFeedAge(3600)).to.be.reverted;
    await expect(presale.setMaxPriceFeedAge(3600)).to.emit(presale, "MaxPriceFeedAgeUpdated");
    expect(await presale.maxPriceFeedAge()).to.equal(3600n);
  });

  it("withdraws raised ETH to treasury", async function () {
    const { buyer1, presale, treasury } = await deployFixtureV2();

    await presale.setSaleActive(true);
    const ethAmount = ethers.parseEther("0.04");
    await presale.connect(buyer1).buyWithETH({ value: ethAmount });

    await expect(() => presale.withdrawRaisedETH(ethAmount)).to.changeEtherBalances(
      [presale, treasury],
      [-ethAmount, ethAmount]
    );
  });

  it("allows claims after ETH purchases when funded", async function () {
    const { buyer1, presale, artm3, treasury } = await deployFixtureV2();

    await presale.setSaleActive(true);
    await presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") });

    const obligation = await presale.getRequiredTokenFunding();
    await artm3.connect(treasury).transfer(await presale.getAddress(), obligation);

    await presale.setClaimActive(true);
    await expect(presale.connect(buyer1).claimTokens()).to.emit(presale, "TokensClaimed");
    expect(await presale.getClaimableAmount(buyer1.address)).to.equal(0n);
  });

  it("continues to block buys once claims are active", async function () {
    const { buyer1, presale, artm3, treasury } = await deployFixtureV2();

    await presale.setSaleActive(true);
    await presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") });

    const obligation = await presale.getRequiredTokenFunding();
    await artm3.connect(treasury).transfer(await presale.getAddress(), obligation);
    await presale.setClaimActive(true);

    await expect(
      presale.connect(buyer1).buyWithETH({ value: ethers.parseEther("0.04") })
    ).to.be.revertedWith("Buying disabled once claims are active");
  });

});
