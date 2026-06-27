import { ethers, run } from "hardhat";
import { DEPLOYMENT_PARAMS } from "./params";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
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
  const treasury = requireEnv("TREASURY_WALLET");
  const usdt = requireEnv("USDT_ADDRESS");
  const usdc = requireEnv("USDC_ADDRESS");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Treasury:", treasury);

  const Token = await ethers.getContractFactory("ArtemisMoonToken");
  const token = await Token.deploy(treasury);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("ArtemisMoonToken deployed:", tokenAddress);

  const presaleArgs = [
    tokenAddress,
    usdt,
    usdc,
    treasury,
    DEPLOYMENT_PARAMS.presale.presaleTokenCap,
    DEPLOYMENT_PARAMS.presale.minimumPurchaseUsd,
    DEPLOYMENT_PARAMS.presale.batchCaps,
    DEPLOYMENT_PARAMS.presale.batchPricesUsd,
  ] as const;

  const Presale = await ethers.getContractFactory("ArtemisMoonPresale");
  const presale = await Presale.deploy(...presaleArgs);
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();

  console.log("ArtemisMoonPresale deployed:", presaleAddress);

  console.log("Waiting before verification...");
  await new Promise((resolve) => setTimeout(resolve, 15000));

  await maybeVerify(tokenAddress, [treasury]);
  await maybeVerify(presaleAddress, presaleArgs as unknown as unknown[]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
