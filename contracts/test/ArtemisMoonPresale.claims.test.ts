import { expect } from "chai";
import { deployFixture, MIN_PURCHASE_USD } from "./helpers";

describe("ArtemisMoonPresale claims", function () {
  it("reverts enabling claims without enough ARMN funding", async function () {
    const { buyer1, presale, usdt } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    await expect(presale.setClaimActive(true)).to.be.revertedWith("Insufficient ARMN funding for claims");
  });

  it("allows claim after sale token funding", async function () {
    const { buyer1, presale, usdt, armn, treasury } = await deployFixture();

    await presale.setSaleActive(true);
    await usdt.connect(buyer1).approve(await presale.getAddress(), MIN_PURCHASE_USD);
    await presale.connect(buyer1).buyWithUSDT(MIN_PURCHASE_USD);

    const obligation = await presale.getRequiredTokenFunding();
    await armn.connect(treasury).transfer(await presale.getAddress(), obligation);

    await expect(presale.setClaimActive(true)).to.emit(presale, "ClaimStatusUpdated");

    const before = await armn.balanceOf(buyer1.address);
    await expect(presale.connect(buyer1).claimTokens()).to.emit(presale, "TokensClaimed");
    const after = await armn.balanceOf(buyer1.address);

    expect(after).to.be.gt(before);
    expect(await presale.getClaimableAmount(buyer1.address)).to.equal(0n);
  });
});
