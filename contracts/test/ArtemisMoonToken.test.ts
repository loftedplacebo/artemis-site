import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArtemisMoonToken", function () {
  it("exposes the Artemis Moon ERC-20 metadata", async function () {
    const [, treasury] = await ethers.getSigners();
    const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
    const token = await ArtemisMoonToken.deploy(treasury.address);
    await token.waitForDeployment();

    expect(await token.name()).to.equal("Artemis Moon");
    expect(await token.symbol()).to.equal("ARMN");
    expect(await token.decimals()).to.equal(18);
  });

  it("mints full supply to treasury", async function () {
    const [, treasury] = await ethers.getSigners();
    const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
    const token = await ArtemisMoonToken.deploy(treasury.address);
    await token.waitForDeployment();

    const expectedSupply = ethers.parseUnits("10000000", 18);

    expect(await token.totalSupply()).to.equal(expectedSupply);
    expect(await token.balanceOf(treasury.address)).to.equal(expectedSupply);
  });

  it("reverts with zero treasury", async function () {
    const ArtemisMoonToken = await ethers.getContractFactory("ArtemisMoonToken");
    await expect(ArtemisMoonToken.deploy(ethers.ZeroAddress)).to.be.revertedWith("Invalid treasury");
  });
});
