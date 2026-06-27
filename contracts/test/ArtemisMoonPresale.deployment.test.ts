import { expect } from "chai";
import { ethers } from "hardhat";
import { deployFixture, BATCH_CAPS, BATCH_PRICES, MIN_PURCHASE_USD, PRESALE_CAP } from "./helpers";

describe("ArtemisMoonPresale deployment", function () {
  it("stores constructor values correctly", async function () {
    const { treasury, armn, usdt, usdc, presale } = await deployFixture();

    expect(await presale.armn()).to.equal(await armn.getAddress());
    expect(await presale.usdt()).to.equal(await usdt.getAddress());
    expect(await presale.usdc()).to.equal(await usdc.getAddress());
    expect(await presale.treasury()).to.equal(treasury.address);
    expect(await presale.presaleTokenCap()).to.equal(PRESALE_CAP);
    expect(await presale.minimumPurchaseUsd()).to.equal(MIN_PURCHASE_USD);
    expect(await presale.currentBatchId()).to.equal(0n);
    expect(await presale.saleActive()).to.equal(false);
    expect(await presale.claimActive()).to.equal(false);
  });

  it("creates all batches correctly", async function () {
    const { presale } = await deployFixture();

    expect(await presale.getBatchCount()).to.equal(6n);

    for (let i = 0; i < BATCH_CAPS.length; i++) {
      const batch = await presale.getBatchInfo(i);
      expect(batch.tokenCap).to.equal(BATCH_CAPS[i]);
      expect(batch.tokensSold).to.equal(0n);
      expect(batch.priceUsd).to.equal(BATCH_PRICES[i]);
    }
  });

  it("reverts if prices are descending", async function () {
    const [owner, treasury] = await ethers.getSigners();

    const MockUSD = await ethers.getContractFactory("MockUSD");
    const usdt = await MockUSD.deploy("Tether USD", "USDT", 6);
    const usdc = await MockUSD.deploy("USD Coin", "USDC", 6);
    await usdt.waitForDeployment();
    await usdc.waitForDeployment();

    const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
    const armn = await ArtemisMoonToken.deploy(treasury.address);
    await armn.waitForDeployment();

    const ArtemisMoonPresale = await ethers.getContractFactory("ArtemisMoonPresale");
    await expect(
      ArtemisMoonPresale.deploy(
        await armn.getAddress(),
        await usdt.getAddress(),
        await usdc.getAddress(),
        treasury.address,
        PRESALE_CAP,
        MIN_PURCHASE_USD,
        BATCH_CAPS,
        [250000, 400000, 300000, 700000, 800000, 900000]
      )
    ).to.be.revertedWith("Prices must ascend");
  });
});