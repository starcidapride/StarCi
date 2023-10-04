// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract LPTick {
    struct Tick {
        uint256 token0;
        uint256 token1;
        uint256 token0Price;
        uint256 timestamp;
    }

    mapping(uint256 => Tick) ticks;

    uint256 private beginIndex;
    uint256 private endIndex;

    uint256 public maxTicks;

    constructor(uint256 _maxTicks) {
        beginIndex = 0;
        endIndex = 0;
        maxTicks = _maxTicks;
    }

    function _generateTick(
        uint256 _token0,
        uint256 _token1,
        uint256 _token0Price
    ) internal {
        if (endIndex - beginIndex == maxTicks) {
            delete ticks[beginIndex];
            beginIndex++;
        }

        endIndex++;

        ticks[endIndex] = Tick(
            _token0,
            _token1, 
            _token0Price,
             block.timestamp);
    }

    function getTicks() external view returns (Tick[] memory) {
        Tick[] memory _ticks = new Tick[](endIndex - beginIndex + 1);
        for (uint256 i = beginIndex; i < endIndex + 1; i++) {
            _ticks[i - beginIndex] = ticks[i];
        }
        return _ticks;
    }
}
