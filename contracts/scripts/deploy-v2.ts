import { ethers, run } from "hardhat";
import { DEPLOYMENT_PARAMS } from "./params";

function requireAddress(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (!ethers.isAddress(value.trim())) {
    throw new Error(`Invalid Ethereum address in ${name}`);
  }

  return ethers.getAddress(value.trim());
}

async function maybeVerify(address: string, args: readonly unknown[]) {
  if (process.env.ETHERSCAN_API_KEY) {
    try {
      await run("verify:verify", {
        address,
        constructorArguments: args,
      });
    } catch (error) {
      console.warn("Verification skipped or failed:", error);
    }
  }
}

async function main() {
  const treasury = requireAddress("TREASURY_WALLET");
  const usdt = requireAddress("USDT_ADDRESS");
  const usdc = requireAddress("USDC_ADDRESS");
  const ethUsdFeed = requireAddress("ETH_USD_PRICE_FEED");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying V2 with:", deployer.address);
  console.log("Treasury:", treasury);
  console.log("ETH/USD feed:", ethUsdFeed);

  const Token = await ethers.getContractFactory("ArtemisToken");
  const token = await Token.deploy(treasury);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("ArtemisToken deployed:", tokenAddress);

  const presaleArgs = [
    tokenAddress,
    usdt,
    usdc,
    treasury,
    ethUsdFeed,
    DEPLOYMENT_PARAMS.chainlink.maxPriceFeedAge,
    DEPLOYMENT_PARAMS.presale.presaleTokenCap,
    DEPLOYMENT_PARAMS.presale.minimumPurchaseUsd,
    DEPLOYMENT_PARAMS.presale.batchCaps,
    DEPLOYMENT_PARAMS.presale.batchPricesUsd,
  ] as const;

  const Presale = await ethers.getContractFactory("ArtemisPresaleV2");
  const presale = await Presale.deploy(...presaleArgs);
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();

  console.log("ArtemisPresaleV2 deployed:", presaleAddress);

  console.log("Waiting before verification...");
  await new Promise((resolve) => setTimeout(resolve, 15000));

  await maybeVerify(tokenAddress, [treasury]);
  await maybeVerify(presaleAddress, presaleArgs as unknown as unknown[]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
