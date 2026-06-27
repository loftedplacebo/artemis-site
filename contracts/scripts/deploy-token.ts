import { ethers, run } from "hardhat";

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
  const [deployer] = await ethers.getSigners();

  console.log("Deploying ArtemisMoonToken with:", deployer.address);
  console.log("Treasury:", treasury);

  const Token = await ethers.getContractFactory("ArtemisMoonToken");
  const deploymentTx = await Token.getDeployTransaction(treasury);
  const estimatedGas = await deployer.estimateGas(deploymentTx);
  const feeData = await ethers.provider.getFeeData();
  const maxFeePerGas = feeData.maxFeePerGas ?? feeData.gasPrice;

  console.log("Estimated gas:", estimatedGas.toString());
  if (maxFeePerGas) {
    console.log("Max fee per gas:", ethers.formatUnits(maxFeePerGas, "gwei"), "gwei");
    console.log("Estimated max fee:", ethers.formatEther(estimatedGas * maxFeePerGas), "ETH");
  }

  const token = await Token.deploy(treasury);
  const tx = token.deploymentTransaction();
  console.log("Submission tx:", tx?.hash);

  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("ArtemisMoonToken deployed:", tokenAddress);
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Decimals:", await token.decimals());
  console.log("Total supply:", ethers.formatUnits(await token.totalSupply(), 18));
  console.log("Treasury balance:", ethers.formatUnits(await token.balanceOf(treasury), 18));

  console.log("Waiting before verification...");
  await new Promise((resolve) => setTimeout(resolve, 15000));

  await maybeVerify(tokenAddress, [treasury]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
