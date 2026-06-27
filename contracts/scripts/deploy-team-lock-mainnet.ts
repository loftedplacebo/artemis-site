import * as fs from "node:fs";
import { ContractFactory, JsonRpcProvider, Wallet, getAddress, isAddress } from "ethers";

const TEAM_ALLOCATION = 500_000n * 10n ** 18n;
const TEAM_UNLOCK_TIME = 1861920000n; // 2029-01-01T00:00:00Z

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
  const beneficiary = requireAddress("TEAM_BENEFICIARY");
  const network = await deployer.provider.getNetwork();

  if (network.chainId !== 1n) {
    throw new Error(`Expected Ethereum mainnet, received chain ${network.chainId}`);
  }

  const artifact = JSON.parse(
    fs.readFileSync("artifacts/contracts/ArtemisMoonTeamLock.sol/ArtemisMoonTeamLock.json", "utf8")
  );
  const latestBlock = await deployer.provider.getBlock("latest");
  if (BigInt(latestBlock?.timestamp || 0) >= TEAM_UNLOCK_TIME) {
    throw new Error("Configured team unlock time is no longer in the future");
  }

  const factory = new ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const teamLock = await factory.deploy(token, beneficiary, TEAM_UNLOCK_TIME);
  const deployment = teamLock.deploymentTransaction();

  console.log("Team-lock submission:", deployment?.hash);
  await deployment?.wait();
  console.log("Team-lock address:", await teamLock.getAddress());
  console.log("Expected funding:", TEAM_ALLOCATION.toString());
  console.log("Beneficiary:", beneficiary);
  console.log("Unlock time:", new Date(Number(TEAM_UNLOCK_TIME) * 1000).toISOString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
