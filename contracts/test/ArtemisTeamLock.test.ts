import { expect } from "chai";
import { ethers } from "hardhat";

describe("ArtemisTeamLock", function () {
  const TEAM_ALLOCATION = ethers.parseUnits("500000", 18);
  const ONE_YEAR = 365 * 24 * 60 * 60;

  async function deployFixture() {
    const [deployer, treasury, beneficiary, caller] = await ethers.getSigners();
    const ArtemisToken = await ethers.getContractFactory("ArtemisToken");
    const token = await ArtemisToken.deploy(treasury.address);
    await token.waitForDeployment();

    const latestBlock = await ethers.provider.getBlock("latest");
    const unlockTime = BigInt((latestBlock?.timestamp || 0) + ONE_YEAR);
    const ArtemisTeamLock = await ethers.getContractFactory("ArtemisTeamLock");
    const teamLock = await ArtemisTeamLock.deploy(
      await token.getAddress(),
      beneficiary.address,
      unlockTime
    );
    await teamLock.waitForDeployment();

    await token.connect(treasury).transfer(await teamLock.getAddress(), TEAM_ALLOCATION);

    return { deployer, treasury, beneficiary, caller, token, teamLock, unlockTime };
  }

  it("stores the token, beneficiary, and immutable unlock time", async function () {
    const { beneficiary, teamLock, token, unlockTime } = await deployFixture();

    expect(await teamLock.artm3()).to.equal(await token.getAddress());
    expect(await teamLock.beneficiary()).to.equal(beneficiary.address);
    expect(await teamLock.unlockTime()).to.equal(unlockTime);
  });

  it("does not release team tokens before the unlock time", async function () {
    const { caller, teamLock } = await deployFixture();

    expect(await teamLock.releasableAmount()).to.equal(0n);
    await expect(teamLock.connect(caller).release()).to.be.revertedWith("Nothing releasable");
  });

  it("releases the full allocation to the beneficiary at the unlock time", async function () {
    const { beneficiary, caller, teamLock, token, unlockTime } = await deployFixture();

    await ethers.provider.send("evm_setNextBlockTimestamp", [Number(unlockTime)]);
    await ethers.provider.send("evm_mine", []);

    await expect(teamLock.connect(caller).release())
      .to.emit(teamLock, "TokensReleased")
      .withArgs(beneficiary.address, TEAM_ALLOCATION, unlockTime + 1n);

    expect(await token.balanceOf(beneficiary.address)).to.equal(TEAM_ALLOCATION);
    expect(await token.balanceOf(await teamLock.getAddress())).to.equal(0n);
  });

  it("rejects invalid constructor values", async function () {
    const [, , beneficiary] = await ethers.getSigners();
    const ArtemisTeamLock = await ethers.getContractFactory("ArtemisTeamLock");
    const latestBlock = await ethers.provider.getBlock("latest");
    const futureUnlockTime = BigInt((latestBlock?.timestamp || 0) + ONE_YEAR);

    await expect(
      ArtemisTeamLock.deploy(ethers.ZeroAddress, beneficiary.address, futureUnlockTime)
    ).to.be.revertedWith("Invalid ARTM3");
    await expect(
      ArtemisTeamLock.deploy(beneficiary.address, ethers.ZeroAddress, futureUnlockTime)
    ).to.be.revertedWith("Invalid beneficiary");
    await expect(
      ArtemisTeamLock.deploy(beneficiary.address, beneficiary.address, 1)
    ).to.be.revertedWith("Unlock must be future");
  });
});
