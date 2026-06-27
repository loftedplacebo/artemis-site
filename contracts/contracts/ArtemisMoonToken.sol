// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


/**
 * ArtemisMoonToken
 * Fixed-supply ERC20. Entire supply is minted once to the treasury on deployment.
 */
contract ArtemisMoonToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 1e18;

    constructor(address treasury) ERC20("Artemis Moon", "ARMN") {
        require(treasury != address(0), "Invalid treasury");
        _mint(treasury, MAX_SUPPLY);
    }
}
