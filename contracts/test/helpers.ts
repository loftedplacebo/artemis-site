import { ethers } from "hardhat";

export const ONE_TOKEN = ethers.parseUnits("1", 18);
export const ONE_USD_6 = ethers.parseUnits("1", 6);

export const PRESALE_CAP = ethers.parseUnits("5000000", 18);
export const MIN_PURCHASE_USD = ethers.parseUnits("25", 6);
export const ETH_USD_PRICE = 2500n * 100000000n; // 8 decimals
export const MAX_PRICE_FEED_AGE = 24n * 60n * 60n;

export const BATCH_CAPS = [
  ethers.parseUnits("500000", 18),
  ethers.parseUnits("750000", 18),
  ethers.parseUnits("1000000", 18),
  ethers.parseUnits("1000000", 18),
  ethers.parseUnits("1250000", 18),
  ethers.parseUnits("500000", 18)
];

export const BATCH_PRICES = [
  250000n,
  400000n,
  550000n,
  700000n,
  800000n,
  900000n
];

export async function deployFixture() {
  const [owner, treasury, buyer1, buyer2] = await ethers.getSigners();

  const MockUSD = await ethers.getContractFactory("MockUSD");
  const usdt = await MockUSD.deploy("Tether USD", "USDT", 6);
  const usdc = await MockUSD.deploy("USD Coin", "USDC", 6);
  await usdt.waitForDeployment();
  await usdc.waitForDeployment();

  const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
  const armn = await ArtemisMoonToken.deploy(treasury.address);
  await armn.waitForDeployment();

  const ArtemisMoonPresale = await ethers.getContractFactory("ArtemisMoonPresale");
  const presale = await ArtemisMoonPresale.deploy(
    await armn.getAddress(),
    await usdt.getAddress(),
    await usdc.getAddress(),
    treasury.address,
    PRESALE_CAP,
    MIN_PURCHASE_USD,
    BATCH_CAPS,
    BATCH_PRICES
  );
  await presale.waitForDeployment();

  const mintAmount = ethers.parseUnits("5000000", 6);
  await usdt.mint(buyer1.address, mintAmount);
  await usdt.mint(buyer2.address, mintAmount);
  await usdc.mint(buyer1.address, mintAmount);
  await usdc.mint(buyer2.address, mintAmount);

  return {
    owner,
    treasury,
    buyer1,
    buyer2,
    armn,
    usdt,
    usdc,
    presale
  };
}

export async function deployFixtureV2(overrides: {
  batchCaps?: bigint[];
  batchPrices?: bigint[];
  presaleCap?: bigint;
  minimumPurchaseUsd?: bigint;
} = {}) {
  const [owner, treasury, buyer1, buyer2] = await ethers.getSigners();
  const batchCaps = overrides.batchCaps || BATCH_CAPS;
  const batchPrices = overrides.batchPrices || BATCH_PRICES;
  const presaleCap = overrides.presaleCap || batchCaps.reduce((sum, cap) => sum + cap, 0n);
  const minimumPurchaseUsd = overrides.minimumPurchaseUsd || MIN_PURCHASE_USD;

  const MockUSD = await ethers.getContractFactory("MockUSD");
  const usdt = await MockUSD.deploy("Tether USD", "USDT", 6);
  const usdc = await MockUSD.deploy("USD Coin", "USDC", 6);
  await usdt.waitForDeployment();
  await usdc.waitForDeployment();

  const MockV3Aggregator = await ethers.getContractFactory("MockV3Aggregator");
  const ethUsdFeed = await MockV3Aggregator.deploy(8, ETH_USD_PRICE);
  await ethUsdFeed.waitForDeployment();

  const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
  const armn = await ArtemisMoonToken.deploy(treasury.address);
  await armn.waitForDeployment();

  const ArtemisMoonPresaleV2 = await ethers.getContractFactory("ArtemisMoonPresaleV2");
  const presale = await ArtemisMoonPresaleV2.deploy(
    await armn.getAddress(),
    await usdt.getAddress(),
    await usdc.getAddress(),
    treasury.address,
    await ethUsdFeed.getAddress(),
    MAX_PRICE_FEED_AGE,
    presaleCap,
    minimumPurchaseUsd,
    batchCaps,
    batchPrices
  );
  await presale.waitForDeployment();

  const mintAmount = ethers.parseUnits("5000000", 6);
  await usdt.mint(buyer1.address, mintAmount);
  await usdt.mint(buyer2.address, mintAmount);
  await usdc.mint(buyer1.address, mintAmount);
  await usdc.mint(buyer2.address, mintAmount);

  return {
    owner,
    treasury,
    buyer1,
    buyer2,
    armn,
    usdt,
    usdc,
    ethUsdFeed,
    presale
  };
}
