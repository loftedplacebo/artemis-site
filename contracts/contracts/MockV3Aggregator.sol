// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockV3Aggregator {
    uint8 private immutable _decimals;
    int256 private _answer;
    uint256 private _updatedAt;
    uint80 private _roundId;

    constructor(uint8 decimals_, int256 answer_) {
        _decimals = decimals_;
        updateAnswer(answer_);
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (_roundId, _answer, _updatedAt, _updatedAt, _roundId);
    }

    function updateAnswer(int256 answer_) public {
        _roundId += 1;
        _answer = answer_;
        _updatedAt = block.timestamp;
    }

    function updateAnswerWithTimestamp(int256 answer_, uint256 updatedAt_) external {
        _roundId += 1;
        _answer = answer_;
        _updatedAt = updatedAt_;
    }
}
