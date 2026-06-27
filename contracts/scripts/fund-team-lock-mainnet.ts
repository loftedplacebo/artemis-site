import { Contract, JsonRpcProvider, Wallet, formatEther, formatUnits, getAddress, isAddress, parseUnits } from "ethers";

const TEAM_ALLOCATION = parseUnits("500000", 18);
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
] as const;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function requireAddress(name: string): string {
  const value = requireEnv(name);
  if (!isAddress(value)) {
    throw new Error(`Invalid ${name}`);
  }

  return getAddress(value);
}

async function main() {
  const provider = new JsonRpcProvider(requireEnv("MAINNET_RPC_URL"));
  const treasury = requireAddress("TREASURY_WALLET");
  const tokenAddress = requireAddress("ARTEMIS_MOON_TOKEN_ADDRESS");
  const teamLock = requireAddress("ARTEMIS_MOON_TEAM_LOCK_ADDRESS");
  const signer = new Wallet(requireEnv("ArtemisTreasuryPrivateKey"), provider);
  const signerAddress = getAddress(await signer.getAddress());
  const network = await provider.getNetwork();

  if (network.chainId !== 1n) {
    throw new Error(`Expected Ethereum mainnet, received chain ${network.chainId}`);
  }

  if (signerAddress !== treasury) {
    throw new Error(`Treasury private key resolves to ${signerAddress}, expected ${treasury}`);
  }

  const token = new Contract(tokenAddress, ERC20_ABI, signer);
  const treasuryBalance = await token.balanceOf(treasury);
  const lockBalance = await token.balanceOf(teamLock);

  console.log("Treasury wallet:", treasury);
  console.log("ARMN token:", tokenAddress);
  console.log("Team lock:", teamLock);
  console.log("Treasury ARMN balance:", formatUnits(treasuryBalance, 18));
  console.log("Team lock ARMN balance before:", formatUnits(lockBalance, 18));
  console.log("Funding amount:", formatUnits(TEAM_ALLOCATION, 18), "ARMN");

  if (treasuryBalance < TEAM_ALLOCATION) {
    throw new Error("Treasury does not have enough ARMN to fund the team lock");
  }

  const estimatedGas = await token.transfer.estimateGas(teamLock, TEAM_ALLOCATION);
  const feeData = await provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;

  console.log("Estimated gas:", estimatedGas.toString());
  if (maxFeePerGas) {
    console.log("Max fee per gas:", formatUnits(maxFeePerGas, "gwei"), "gwei");
    console.log("Estimated max fee:", formatEther(estimatedGas * maxFeePerGas), "ETH");
  }

  const tx = await token.transfer(teamLock, TEAM_ALLOCATION);
  console.log("Transfer submission:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transfer mined in block:", receipt?.blockNumber);
  console.log("Gas used:", receipt?.gasUsed.toString());

  const finalTreasuryBalance = await token.balanceOf(treasury);
  const finalLockBalance = await token.balanceOf(teamLock);
  console.log("Treasury ARMN balance after:", formatUnits(finalTreasuryBalance, 18));
  console.log("Team lock ARMN balance after:", formatUnits(finalLockBalance, 18));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
