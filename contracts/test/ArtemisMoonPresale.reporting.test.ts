import { expect } from "chai";
import { deployFixture, MIN_PURCHASE_USD } from "./helpers";

describe("ArtemisMoonPresale reporting", function () {
  it("returns dashboard data and purchases for a wallet", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD * 2n);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    const dashboard = await presale.getBuyerDashboard(buyer1.address);
    expect(dashboard.totalUsdSpent).to.equal(MIN_PURCHASE_USD * 2n);
    expect(dashboard.purchaseCount).to.equal(2n);
    expect(dashboard.purchaseIds.length).to.equal(2);

    const purchases = await presale.getBuyerPurchases(buyer1.address);
    expect(purchases.length).to.equal(2);
    expect(purchases[0].buyer).to.equal(buyer1.address);
  });

  it("returns funding status correctly", async function () {
    const { presale } = await deployFixture();

    const status = await presale.getContractTokenFundingStatus();
    expect(status.contractBalance).to.equal(0n);
    expect(status.outstandingObligation).to.equal(0n);
    expect(status.sufficientlyFunded).to.equal(true);
  });
});