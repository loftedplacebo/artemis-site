import { expect } from "chai";
import { deployFixture, MIN_PURCHASE_USD } from "./helpers";

describe("ArtemisMoonPresale purchases", function () {
  it("buys with USDT and records purchase history", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);

    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await expect(presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD)).to.emit(presale, "TokensPurchased");

    const summary = await presale.getBuyerSummary(buyer1.address);
    expect(summary.totalUsdSpent).to.equal(MIN_PURCHASE_USD);
    expect(summary.purchaseCount).to.equal(1n);
    expect(summary.claimableAmount).to.be.gt(0n);

    const ids = await presale.getBuyerPurchaseIds(buyer1.address);
    expect(ids.length).to.equal(1);

    const purchase = await presale.getPurchase(ids[0]);
    expect(purchase.buyer).to.equal(buyer1.address);
    expect(purchase.paymentToken).to.equal(await usdt.getAddress());
    expect(purchase.paymentAmount).to.equal(MIN_PURCHASE_USD);
    expect(purchase.usdValue).to.equal(MIN_PURCHASE_USD);
    expect(purchase.tokensAllocated).to.be.gt(0n);
  });

  it("buys with USDC", async function () {
    const { buyer1, presale, usdc } = await deployFixture();

    await presale.setSaleActive(true);
    await usdc.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);

    await expect(presale.connect(buyer1).buyWithUSDC(MIN_PURCHASE_USD)).to.emit(presale, "TokensPurchased");

    const summary = await presale.getBuyerSummary(buyer1.address);
    expect(summary.totalUsdSpent).to.equal(MIN_PURCHASE_USD);
    expect(summary.purchaseCount).to.equal(1n);
  });

  it("reverts when sale inactive", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await expect(presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD)).to.be.revertedWith("Sale inactive");
  });

  it("reverts below minimum", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD - 1n);
    await expect(presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD - 1n)).to.be.revertedWith("Below minimum purchase");
  });

  it("blocks buying once claims are active", async function () {
    const { buyer1, presale, usdt, armn, treasury } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    const obligation = await presale.getRequiredTokenFunding();
    await armn.connect(treasury).transfer(await presale.getAddress(), obligation);

    await presale.setClaimActive(true);

    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await expect(presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD)).to.be.revertedWith("Buying disabled once claims are active");
  });

  it("reverts when buyer has not approved enough stablecoin", async function () {
    const { buyer1, presale } = await deployFixture();

    await presale.setSaleActive(true);
    await expect(presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD)).to.be.reverted;
  });
});