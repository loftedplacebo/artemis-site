import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixture, BATCH_CAPS, BATCH_PRICES, MIN_PURCHASE_USD } from "./helpers";

describe("ArtemisMoonPresale batch transitions", function () {
  it("fills batch 1 exactly and moves to batch 2", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);

    const exactBatchOneUsd = (BATCH_CAPS[0] * BATCH_PRICES[0]) / ethers.parseUnits("1", 18);
    await usdt.connect(buyer1).approve(await presale.getAddress(), exactBatchOneUsd);
    await presale.connect(buyer1).buyWithUSDT(exactBatchOneUsd);

    expect(await presale.currentBatchId()).to.equal(1n);

    const batch0 = await presale.getBatchInfo(0);
    expect(batch0.tokensSold).to.equal(BATCH_CAPS[0]);
    expect(batch0.tokensRemaining).to.equal(0n);
  });

  it("spans two batches in one purchase", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);

    const batchOneUsd = (BATCH_CAPS[0] * BATCH_PRICES[0]) / ethers.parseUnits("1", 18);
    const extraUsd = MIN_PURCHASE_USD;
    const totalUsd = batchOneUsd + extraUsd;

    await usdt.connect(buyer1).approve(await presale.getAddress(), totalUsd);
    await presale.connect(buyer1).buyWithUSDT(totalUsd);

    expect(await presale.currentBatchId()).to.equal(1n);

    const ids = await presale.getBuyerPurchaseIds(buyer1.address);
    const purchase = await presale.getPurchase(ids[0]);
    expect(purchase.startBatchId).to.equal(0n);
    expect(purchase.endBatchId).to.equal(1n);

    const batch0 = await presale.getBatchInfo(0);
    const batch1 = await presale.getBatchInfo(1);
    expect(batch0.tokensRemaining).to.equal(0n);
    expect(batch1.tokensSold).to.be.gt(0n);
  });

  it("reverts when purchase amount cannot be fully allocated near sellout", async function () {
    const { buyer1, buyer2, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);

    // Fill batches 1-5 exactly: $2,675,000
    const firstFiveBatchesUsd = 2_675_000n * 1_000_000n;
    await usdt.connect(buyer1).approve(await presale.getAddress(), firstFiveBatchesUsd);
    await presale.connect(buyer1).buyWithUSDT(firstFiveBatchesUsd);

    // Fill most of final batch exactly, leaving only $18 capacity (< $25 minimum)
    const almostAllFinalBatchUsd = 449_982n * 1_000_000n;
    await usdt.connect(buyer1).approve(await presale.getAddress(), almostAllFinalBatchUsd);
    await presale.connect(buyer1).buyWithUSDT(almostAllFinalBatchUsd);

    await usdt.connect(buyer2).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await expect(
      presale.connect(buyer2).buyWithUSDT(MIN_PURCHASE_USD)
    ).to.be.revertedWith("Amount crosses remaining cap; use smaller amount");
  });
});