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
 * ArtemisMoonPresale
 * V1 scope:
 * - Accepts USDT and USDC
 * - USD-priced batches
 * - Deferred claim model
 * - Tracks buyer purchase history and allocations
 * - Includes frontend-friendly reporting getters for wallet dashboards
 * - Requires full ARMN claim funding before claims can be enabled
 * - Keeps raised funds and sale-token recovery paths separated
 * - No ETH support in V1
 */
contract ArtemisMoonPresale is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant USD_DECIMALS = 1e6;
    uint256 public constant TOKEN_DECIMALS = 1e18;

    IERC20 public immutable armn;
    IERC20 public immutable usdt;
    IERC20 public immutable usdc;

    address public treasury;

    bool public saleActive;
    bool public claimActive;

    uint256 public immutable presaleTokenCap;
    uint256 public totalTokensSold;
    uint256 public totalTokensClaimed;
    uint256 public totalUsdRaised;
    uint256 public totalPurchases;
    uint256 public minimumPurchaseUsd;
    uint256 public currentBatchId;

    struct Batch {
        uint256 tokenCap;      // 18 decimals
        uint256 tokensSold;    // 18 decimals
        uint256 priceUsd;      // 6 decimals, e.g. $0.25 = 250000
    }

    struct Buyer {
        uint256 totalUsdSpent;        // 6 decimals
        uint256 totalTokensAllocated; // 18 decimals
        uint256 totalTokensClaimed;   // 18 decimals
        uint256 purchaseCount;
    }

    struct Purchase {
        uint256 id;
        address buyer;
        address paymentToken;
        uint256 paymentAmount;     // payment token native decimals, assumed 6 for USDT/USDC
        uint256 usdValue;          // 6 decimals
        uint256 tokensAllocated;   // 18 decimals
        uint256 timestamp;
        uint256 startBatchId;
        uint256 endBatchId;
    }

    struct QuoteResult {
        uint256 usdUsed;           // 6 decimals
        uint256 tokensAllocated;   // 18 decimals
        uint256 startBatchId;
        uint256 endBatchId;
    }

    Batch[] public batches;

    mapping(address => Buyer) public buyers;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => uint256[]) public buyerPurchaseIds;

    event TokensPurchased(
        uint256 indexed purchaseId,
        address indexed buyer,
        address indexed paymentToken,
        uint256 paymentAmount,
        uint256 usdValue,
        uint256 tokensAllocated,
        uint256 startBatchId,
        uint256 endBatchId,
        uint256 timestamp
    );

    event TokensClaimed(address indexed buyer, uint256 amount, uint256 timestamp);
    event SaleStatusUpdated(bool saleActive);
    event ClaimStatusUpdated(bool claimActive);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event FundsWithdrawn(address indexed token, address indexed to, uint256 amount);
    event MinimumPurchaseUpdated(uint256 oldAmount, uint256 newAmount);
    event SaleTokenFundingReceived(address indexed from, uint256 amount);
    event ClaimFundingValidated(uint256 obligation, uint256 contractBalance);

    constructor(
        address _armn,
        address _usdt,
        address _usdc,
        address _treasury,
        uint256 _presaleTokenCap,
        uint256 _minimumPurchaseUsd,
        uint256[] memory _batchCaps,
        uint256[] memory _batchPricesUsd
    ) Ownable(msg.sender) {
        require(_armn != address(0), "Invalid ARMN");
        require(_usdt != address(0), "Invalid USDT");
        require(_usdc != address(0), "Invalid USDC");
        require(_treasury != address(0), "Invalid treasury");
        require(_presaleTokenCap > 0, "Invalid presale cap");
        require(IERC20Metadata(_usdt).decimals() == 6, "USDT must have 6 decimals");
        require(IERC20Metadata(_usdc).decimals() == 6, "USDC must have 6 decimals");
        require(_minimumPurchaseUsd > 0, "Invalid minimum purchase");
        require(_batchCaps.length > 0, "No batches");
        require(_batchCaps.length == _batchPricesUsd.length, "Batch array mismatch");

        armn = IERC20(_armn);
        usdt = IERC20(_usdt);
        usdc = IERC20(_usdc);
        treasury = _treasury;
        presaleTokenCap = _presaleTokenCap;
        minimumPurchaseUsd = _minimumPurchaseUsd;

        uint256 capSum = 0;
        uint256 lastPrice = 0;

        for (uint256 i = 0; i < _batchCaps.length; i++) {
            require(_batchCaps[i] > 0, "Zero batch cap");
            require(_batchPricesUsd[i] > 0, "Zero batch price");
            require(_batchPricesUsd[i] >= lastPrice, "Prices must ascend");

            batches.push(Batch({
                tokenCap: _batchCaps[i],
                tokensSold: 0,
                priceUsd: _batchPricesUsd[i]
            }));

            capSum += _batchCaps[i];
            lastPrice = _batchPricesUsd[i];
        }

        require(capSum == _presaleTokenCap, "Batch caps must equal presale cap");
    }

    // ------------------------------
    // User purchase functions
    // ------------------------------

    function buyWithUSDT(uint256 amount) external nonReentrant whenNotPaused {
        _buy(address(usdt), amount);
    }

    function buyWithUSDC(uint256 amount) external nonReentrant whenNotPaused {
        _buy(address(usdc), amount);
    }

    function claimTokens() external nonReentrant whenNotPaused {
        require(claimActive, "Claim inactive");

        uint256 claimable = getClaimableAmount(msg.sender);
        require(claimable > 0, "Nothing to claim");
        require(armn.balanceOf(address(this)) >= claimable, "Insufficient ARMN in contract");

        buyers[msg.sender].totalTokensClaimed += claimable;
        totalTokensClaimed += claimable;

        armn.safeTransfer(msg.sender, claimable);

        emit TokensClaimed(msg.sender, claimable, block.timestamp);
    }

    // ------------------------------
    // Read functions
    // ------------------------------

    function getBatchCount() external view returns (uint256) {
        return batches.length;
    }

    function getBatchInfo(uint256 batchId)
        external
        view
        returns (uint256 tokenCap, uint256 tokensSold, uint256 priceUsd, uint256 tokensRemaining)
    {
        require(batchId < batches.length, "Invalid batch");
        Batch memory batch = batches[batchId];
        return (
            batch.tokenCap,
            batch.tokensSold,
            batch.priceUsd,
            batch.tokenCap - batch.tokensSold
        );
    }

    function getTokensRemainingInPresale() public view returns (uint256) {
        return presaleTokenCap - totalTokensSold;
    }

    function getClaimableAmount(address user) public view returns (uint256) {
        Buyer memory buyer = buyers[user];
        return buyer.totalTokensAllocated - buyer.totalTokensClaimed;
    }

    function getBuyerSummary(address user)
        external
        view
        returns (
            uint256 totalUsdSpent,
            uint256 totalTokensAllocated,
            uint256 totalTokensClaimed_,
            uint256 claimableAmount,
            uint256 purchaseCount
        )
    {
        Buyer memory buyer = buyers[user];
        return (
            buyer.totalUsdSpent,
            buyer.totalTokensAllocated,
            buyer.totalTokensClaimed,
            buyer.totalTokensAllocated - buyer.totalTokensClaimed,
            buyer.purchaseCount
        );
    }

    function getBuyerPurchaseCount(address user) external view returns (uint256) {
        return buyerPurchaseIds[user].length;
    }

    function getBuyerPurchaseIds(address user) external view returns (uint256[] memory) {
        return buyerPurchaseIds[user];
    }

    function getBuyerPurchaseIdByIndex(address user, uint256 index) external view returns (uint256) {
        require(index < buyerPurchaseIds[user].length, "Purchase index out of range");
        return buyerPurchaseIds[user][index];
    }

    function getBuyerPurchases(address user) external view returns (Purchase[] memory) {
        uint256[] memory ids = buyerPurchaseIds[user];
        Purchase[] memory result = new Purchase[](ids.length);

        for (uint256 i = 0; i < ids.length; i++) {
            result[i] = purchases[ids[i]];
        }

        return result;
    }

    function getPurchase(uint256 purchaseId) external view returns (Purchase memory) {
        require(purchaseId > 0 && purchaseId <= totalPurchases, "Invalid purchase ID");
        return purchases[purchaseId];
    }

    function getSaleStatus()
        external
        view
        returns (
            bool _saleActive,
            bool _claimActive,
            bool _paused,
            uint256 _currentBatchId,
            uint256 _totalTokensSold,
            uint256 _totalUsdRaised
        )
    {
        return (
            saleActive,
            claimActive,
            paused(),
            currentBatchId,
            totalTokensSold,
            totalUsdRaised
        );
    }

    function getBuyerDashboard(address user)
        external
        view
        returns (
            uint256 totalUsdSpent,
            uint256 totalTokensAllocated,
            uint256 totalTokensClaimed_,
            uint256 claimableAmount,
            uint256 purchaseCount,
            uint256[] memory purchaseIds
        )
    {
        Buyer memory buyer = buyers[user];
        return (
            buyer.totalUsdSpent,
            buyer.totalTokensAllocated,
            buyer.totalTokensClaimed,
            buyer.totalTokensAllocated - buyer.totalTokensClaimed,
            buyer.purchaseCount,
            buyerPurchaseIds[user]
        );
    }

    function quoteForUSDT(uint256 amount) external view returns (QuoteResult memory) {
        return _quoteTokensForUsd(amount);
    }

    function quoteForUSDC(uint256 amount) external view returns (QuoteResult memory) {
        return _quoteTokensForUsd(amount);
    }

    function getRequiredTokenFunding() public view returns (uint256) {
        return totalTokensSold - totalTokensClaimed;
    }

    function getContractTokenFundingStatus()
        external
        view
        returns (
            uint256 contractBalance,
            uint256 outstandingObligation,
            uint256 excessFunding,
            bool sufficientlyFunded
        )
    {
        uint256 balance = armn.balanceOf(address(this));
        uint256 obligation = getRequiredTokenFunding();
        uint256 excess = balance > obligation ? balance - obligation : 0;

        return (balance, obligation, excess, balance >= obligation);
    }

    // ------------------------------
    // Admin functions
    // ------------------------------

    function setSaleActive(bool active) external onlyOwner {
        saleActive = active;
        emit SaleStatusUpdated(active);
    }

    function setClaimActive(bool active) external onlyOwner {
        if (active) {
            uint256 obligation = getRequiredTokenFunding();
            uint256 balance = armn.balanceOf(address(this));
            require(balance >= obligation, "Insufficient ARMN funding for claims");
            emit ClaimFundingValidated(obligation, balance);
        }

        claimActive = active;
        emit ClaimStatusUpdated(active);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury");
        address oldTreasury = treasury;
        treasury = newTreasury;
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }

    function setMinimumPurchaseUsd(uint256 newMinimum) external onlyOwner {
        require(newMinimum > 0, "Invalid minimum");
        uint256 oldMinimum = minimumPurchaseUsd;
        minimumPurchaseUsd = newMinimum;
        emit MinimumPurchaseUpdated(oldMinimum, newMinimum);
    }

    function withdrawRaisedFunds(address token, uint256 amount) external onlyOwner {
        require(token == address(usdt) || token == address(usdc), "Unsupported token");
        require(amount > 0, "Zero amount");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient balance");
        IERC20(token).safeTransfer(treasury, amount);
        emit FundsWithdrawn(token, treasury, amount);
    }

    function recoverNonSaleToken(address token, uint256 amount) external onlyOwner {
        require(token != address(armn), "Use sale funding discipline for ARMN");
        require(token != address(usdt) && token != address(usdc), "Use withdrawRaisedFunds for sale proceeds");
        require(amount > 0, "Zero amount");
        require(IERC20(token).balanceOf(address(this)) >= amount, "Insufficient balance");
        IERC20(token).safeTransfer(treasury, amount);
        emit FundsWithdrawn(token, treasury, amount);
    }

    function withdrawExcessSaleTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");

        uint256 balance = armn.balanceOf(address(this));
        uint256 obligation = getRequiredTokenFunding();
        uint256 excess = balance > obligation ? balance - obligation : 0;

        require(amount <= excess, "Amount exceeds excess ARMN");

        armn.safeTransfer(treasury, amount);
        emit FundsWithdrawn(address(armn), treasury, amount);
    }

    // ------------------------------
    // Internal logic
    // ------------------------------

    function _buy(address paymentToken, uint256 amount) internal {
        require(saleActive, "Sale inactive");
        require(!claimActive, "Buying disabled once claims are active");
        require(paymentToken == address(usdt) || paymentToken == address(usdc), "Unsupported payment token");
        require(amount >= minimumPurchaseUsd, "Below minimum purchase");
        require(totalTokensSold < presaleTokenCap, "Presale sold out");

        QuoteResult memory quote = _quoteTokensForUsd(amount);

        require(quote.tokensAllocated > 0, "No tokens allocatable");
        require(quote.usdUsed == amount, "Amount crosses remaining cap; use smaller amount");
        require(totalTokensSold + quote.tokensAllocated <= presaleTokenCap, "Exceeds presale cap");

        IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), amount);

        _applyBatchAllocation(quote.tokensAllocated);

        totalPurchases += 1;
        totalUsdRaised += amount;
        totalTokensSold += quote.tokensAllocated;

        Buyer storage buyer = buyers[msg.sender];
        buyer.totalUsdSpent += amount;
        buyer.totalTokensAllocated += quote.tokensAllocated;
        buyer.purchaseCount += 1;

        purchases[totalPurchases] = Purchase({
            id: totalPurchases,
            buyer: msg.sender,
            paymentToken: paymentToken,
            paymentAmount: amount,
            usdValue: amount,
            tokensAllocated: quote.tokensAllocated,
            timestamp: block.timestamp,
            startBatchId: quote.startBatchId,
            endBatchId: quote.endBatchId
        });

        buyerPurchaseIds[msg.sender].push(totalPurchases);

        emit TokensPurchased(
            totalPurchases,
            msg.sender,
            paymentToken,
            amount,
            amount,
            quote.tokensAllocated,
            quote.startBatchId,
            quote.endBatchId,
            block.timestamp
        );
    }

    function notifySaleTokenFunding(uint256 amount) external onlyOwner {
        require(amount > 0, "Zero amount");
        emit SaleTokenFundingReceived(msg.sender, amount);
    }

    function _quoteTokensForUsd(uint256 usdAmount) internal view returns (QuoteResult memory result) {
        require(usdAmount > 0, "Zero amount");

        uint256 remainingUsd = usdAmount;
        bool started = false;

        for (uint256 i = currentBatchId; i < batches.length; i++) {
            Batch memory batch = batches[i];
            uint256 batchRemaining = batch.tokenCap - batch.tokensSold;

            if (batchRemaining == 0) {
                continue;
            }

            if (!started) {
                result.startBatchId = i;
                started = true;
            }

            // Max whole token units purchasable in this batch from remainingUsd
            // tokens = usd / price, scaled to 18 decimals => usdAmount(6dp) * 1e18 / price(6dp)
            uint256 tokensAtThisPrice = (remainingUsd * TOKEN_DECIMALS) / batch.priceUsd;

            if (tokensAtThisPrice == 0) {
                break;
            }

            if (tokensAtThisPrice >= batchRemaining) {
                uint256 usdNeededForFullBatch = (batchRemaining * batch.priceUsd) / TOKEN_DECIMALS;
                result.tokensAllocated += batchRemaining;
                result.usdUsed += usdNeededForFullBatch;
                remainingUsd -= usdNeededForFullBatch;
                result.endBatchId = i;
            } else {
                uint256 usdUsedHere = (tokensAtThisPrice * batch.priceUsd) / TOKEN_DECIMALS;
                result.tokensAllocated += tokensAtThisPrice;
                result.usdUsed += usdUsedHere;
                result.endBatchId = i;
                remainingUsd -= usdUsedHere;
                break;
            }
        }
    }

    function _applyBatchAllocation(uint256 tokensToAllocate) internal {
        uint256 remaining = tokensToAllocate;

        for (uint256 i = currentBatchId; i < batches.length; i++) {
            Batch storage batch = batches[i];
            uint256 batchRemaining = batch.tokenCap - batch.tokensSold;

            if (batchRemaining == 0) {
                if (i == currentBatchId && currentBatchId < batches.length - 1) {
                    currentBatchId += 1;
                }
                continue;
            }

            if (remaining >= batchRemaining) {
                batch.tokensSold += batchRemaining;
                remaining -= batchRemaining;

                if (i == currentBatchId && currentBatchId < batches.length - 1) {
                    currentBatchId += 1;
                }
            } else {
                batch.tokensSold += remaining;
                remaining = 0;
                break;
            }
        }

        require(remaining == 0, "Batch allocation incomplete");
    }
}

/**
 * Example Artemis constructor values:
 *
 * _presaleTokenCap    = 5_000_000 * 1e18
 * _minimumPurchaseUsd = 25 * 1e6
 *
 * _batchCaps = [
 *   500_000 * 1e18,
 *   750_000 * 1e18,
 *   1_000_000 * 1e18,
 *   1_000_000 * 1e18,
 *   1_250_000 * 1e18,
 *   500_000 * 1e18
 * ]
 *
 * _batchPricesUsd = [
 *   250_000,
 *   400_000,
 *   550_000,
 *   700_000,
 *   800_000,
 *   900_000
 * ]
 */
