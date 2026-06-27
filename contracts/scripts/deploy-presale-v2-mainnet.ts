import * as fs from "node:fs";
import { ContractFactory, JsonRpcProvider, Wallet, getAddress, isAddress, formatEther, formatUnits } from "ethers";
import { DEPLOYMENT_PARAMS } from "./params";

function requireAddress(name: string): string {
  const value = process.env[name]?.trim();
  if (!value || !isAddress(value)) {
    throw new Error(`Missing or invalid ${name}`);
  }

  return getAddress(value);
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

async function main() {
  const rpcUrl = requireEnv("MAINNET_RPC_URL");
  const deployer = new Wallet(requireEnv("PRIVATE_KEY"), new JsonRpcProvider(rpcUrl));
  const token = requireAddress("ARTEMIS_MOON_TOKEN_ADDRESS");
  const treasury = requireAddress("TREASURY_WALLET");
  const usdt = requireAddress("USDT_ADDRESS");
  const usdc = requireAddress("USDC_ADDRESS");
  const ethUsdFeed = requireAddress("ETH_USD_PRICE_FEED");
  const network = await deployer.provider.getNetwork();

  if (network.chainId !== 1n) {
    throw new Error(`Expected Ethereum mainnet, received chain ${network.chainId}`);
  }

  const artifact = JSON.parse(
    fs.readFileSync("artifacts/contracts/ArtemisMoonPresaleV2.sol/ArtemisMoonPresaleV2.json", "utf8")
  );

  const presaleArgs = [
    token,
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

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const deploymentTx = await factory.getDeployTransaction(...presaleArgs);
  const estimatedGas = await deployer.estimateGas(deploymentTx);
  const feeData = await deployer.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;

  console.log("Deploying ArtemisMoonPresaleV2 with:", deployer.address);
  console.log("ARMN token:", token);
  console.log("Treasury:", treasury);
  console.log("USDT:", usdt);
  console.log("USDC:", usdc);
  console.log("ETH/USD feed:", ethUsdFeed);
  console.log("Estimated gas:", estimatedGas.toString());
  if (maxFeePerGas) {
    console.log("Max fee per gas:", formatUnits(maxFeePerGas, "gwei"), "gwei");
    console.log("Estimated max fee:", formatEther(estimatedGas * maxFeePerGas), "ETH");
  }

  const presale = await factory.deploy(...presaleArgs);
  const deployment = presale.deploymentTransaction();
  console.log("Presale submission:", deployment?.hash);

  await deployment?.wait();
  console.log("Presale address:", await presale.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
