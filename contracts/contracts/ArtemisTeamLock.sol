// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * Holds the Artemis team allocation until a single immutable unlock time.
 * Anyone may trigger release, but tokens can only be sent to the beneficiary.
 */
contract ArtemisTeamLock is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable artm3;
    address public immutable beneficiary;
    uint256 public immutable unlockTime;

    event TokensReleased(address indexed beneficiary, uint256 amount, uint256 timestamp);

    constructor(address _artm3, address _beneficiary, uint256 _unlockTime) {
        require(_artm3 != address(0), "Invalid ARTM3");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_unlockTime > block.timestamp, "Unlock must be future");

        artm3 = IERC20(_artm3);
        beneficiary = _beneficiary;
        unlockTime = _unlockTime;
    }

    function releasableAmount() public view returns (uint256) {
        if (block.timestamp < unlockTime) {
            return 0;
        }

        return artm3.balanceOf(address(this));
    }

    function release() external nonReentrant {
        uint256 amount = releasableAmount();
        require(amount > 0, "Nothing releasable");

        artm3.safeTransfer(beneficiary, amount);
        emit TokensReleased(beneficiary, amount, block.timestamp);
    }
}
