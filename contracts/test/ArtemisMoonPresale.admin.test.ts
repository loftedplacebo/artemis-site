import { expect } from "chai";
import { deployFixture, MIN_PURCHASE_USD } from "./helpers";

describe("ArtemisMoonPresale admin", function () {
  it("only owner can pause and update treasury", async function () {
    const { buyer1, presale, treasury } = await deployFixture();

    await expect(presale.connect(buyer1).pause()).to.be.reverted;
    await expect(presale.connect(buyer1).setTreasury(buyer1.address)).to.be.reverted;

    await presale.pause();
    expect(await presale.paused()).to.equal(true);

    await presale.unpause();
    await presale.setTreasury(buyer1.address);
    expect(await presale.treasury()).to.equal(buyer1.address);

    await presale.setTreasury(treasury.address);
  });

  it("owner can withdraw raised funds to treasury", async function () {
    const { buyer1, presale, usdt, treasury } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    const before = await usdt.balanceOf(treasury.address);
    await expect(presale.withdrawRaisedFunds(await usdt.getAddress(), MIN_PURCHASE_USD)).to.emit(presale, "FundsWithdrawn");
    const after = await usdt.balanceOf(treasury.address);

    expect(after - before).to.equal(MIN_PURCHASE_USD);
  });

  it("blocks non-owner fund withdrawal", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    await expect(
      presale.connect(buyer1).withdrawRaisedFunds(await usdt.getAddress(), MIN_PURCHASE_USD)
    ).to.be.reverted;
  });

  it("only withdraws excess ARMN above buyer obligations", async function () {
    const { buyer1, presale, usdt, armn, treasury } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    const obligation = await presale.getRequiredTokenFunding();
    const extra = 1000n;
    await armn.connect(treasury).transfer(await presale.getAddress(), obligation + extra);

    await expect(presale.withdrawExcessSaleTokens(extra)).to.emit(presale, "FundsWithdrawn");
    await expect(presale.withdrawExcessSaleTokens(1n)).to.be.revertedWith("Amount exceeds excess ARMN");
  });
});
