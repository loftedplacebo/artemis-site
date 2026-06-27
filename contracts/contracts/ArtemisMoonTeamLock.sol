// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Holds the Artemis Moon team allocation until a single immutable unlock time.
 * Anyone may trigger release, but tokens can only be sent to the beneficiary.
 */
contract ArtemisMoonTeamLock is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable armn;
    address public immutable beneficiary;
    uint256 public immutable unlockTime;

    event TokensReleased(address indexed beneficiary, uint256 amount, uint256 timestamp);

    constructor(address _armn, address _beneficiary, uint256 _unlockTime) {
        require(_armn != address(0), "Invalid ARMN");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_unlockTime > block.timestamp, "Unlock must be future");

        armn = IERC20(_armn);
        beneficiary = _beneficiary;
        unlockTime = _unlockTime;
    }

    function releasableAmount() public view returns (uint256) {
        if (block.timestamp < unlockTime) {
            return 0;
        }

        return armn.balanceOf(address(this));
    }

    function release() external nonReentrant {
        uint256 amount = releasableAmount();
        require(amount > 0, "Nothing releasable");

        armn.safeTransfer(beneficiary, amount);
        emit TokensReleased(beneficiary, amount, block.timestamp);
    }
}
