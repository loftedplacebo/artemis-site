import { Contract, JsonRpcProvider, Wallet, formatEther, formatUnits, getAddress, isAddress, parseUnits } from "ethers";

const PRESALE_ALLOCATION = parseUnits("5000000", 18);
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
] as const;
const PRESALE_ABI = [
  "function getSaleStatus() view returns (bool saleActive,bool claimActive,bool paused,uint256 currentBatchId,uint256 totalTokensSold,uint256 totalUsdRaised)",
  "function getContractTokenFundingStatus() view returns (uint256 contractBalance,uint256 outstandingObligation,uint256 excessFunding,bool sufficientlyFunded)",
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
  const presaleAddress = requireAddress("ARTEMIS_MOON_PRESALE_ADDRESS");
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
  const presale = new Contract(presaleAddress, PRESALE_ABI, provider);
  const saleStatus = await presale.getSaleStatus();
  const fundingStatus = await presale.getContractTokenFundingStatus();
  const treasuryBalance = await token.balanceOf(treasury);
  const presaleBalance = await token.balanceOf(presaleAddress);

  console.log("Treasury wallet:", treasury);
  console.log("ARMN token:", tokenAddress);
  console.log("Presale:", presaleAddress);
  console.log("Sale active:", saleStatus.saleActive);
  console.log("Claims active:", saleStatus.claimActive);
  console.log("Paused:", saleStatus.paused);
  console.log("Treasury ARMN balance:", formatUnits(treasuryBalance, 18));
  console.log("Presale ARMN balance before:", formatUnits(presaleBalance, 18));
  console.log("Outstanding buyer obligation:", formatUnits(fundingStatus.outstandingObligation, 18));
  console.log("Funding amount:", formatUnits(PRESALE_ALLOCATION, 18), "ARMN");

  if (saleStatus.saleActive || saleStatus.claimActive) {
    throw new Error("Refusing to fund while sale or claims are active");
  }

  if (treasuryBalance < PRESALE_ALLOCATION) {
    throw new Error("Treasury does not have enough ARMN to fund the presale");
  }

  const estimatedGas = await token.transfer.estimateGas(presaleAddress, PRESALE_ALLOCATION);
  const feeData = await provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;

  console.log("Estimated gas:", estimatedGas.toString());
  if (maxFeePerGas) {
    console.log("Max fee per gas:", formatUnits(maxFeePerGas, "gwei"), "gwei");
    console.log("Estimated max fee:", formatEther(estimatedGas * maxFeePerGas), "ETH");
  }

  const tx = await token.transfer(presaleAddress, PRESALE_ALLOCATION);
  console.log("Transfer submission:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transfer mined in block:", receipt?.blockNumber);
  console.log("Gas used:", receipt?.gasUsed.toString());

  const finalTreasuryBalance = await token.balanceOf(treasury);
  const finalPresaleBalance = await token.balanceOf(presaleAddress);
  const finalFundingStatus = await presale.getContractTokenFundingStatus();
  const finalSaleStatus = await presale.getSaleStatus();

  console.log("Treasury ARMN balance after:", formatUnits(finalTreasuryBalance, 18));
  console.log("Presale ARMN balance after:", formatUnits(finalPresaleBalance, 18));
  console.log("Sale active after:", finalSaleStatus.saleActive);
  console.log("Claims active after:", finalSaleStatus.claimActive);
  console.log("Outstanding buyer obligation after:", formatUnits(finalFundingStatus.outstandingObligation, 18));
  console.log("Sufficiently funded after:", finalFundingStatus.sufficientlyFunded);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
