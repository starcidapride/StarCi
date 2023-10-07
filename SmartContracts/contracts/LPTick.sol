// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract LPTick {
    struct Tick {
        uint256 amountToken0Locked;
        uint256 amountToken1Locked;
        uint256 token0Price;
        uint256 amount0In;
        uint256 amount1In;
        uint256 amount0Out;
        uint256 amount1Out;
        uint256 timestamp;
    }

    mapping(uint256 => Tick) ticks;

    uint256 private numTicks;

    constructor() {
        numTicks = 0;
    }

    function _generateTick(
        uint256 _amountToken0Locked,
        uint256 _amountToken1Locked,
        uint256 _token0Price,
        uint256 _amount0In,
        uint256 _amount1In,
        uint256 _amount0Out,
        uint256 _amount1Out
    ) internal {
        ticks[numTicks] = Tick(
            _amountToken0Locked,
            _amountToken1Locked,
            _token0Price,
            _amount0In,
            _amount1In,
            _amount0Out,
            _amount1Out,
            block.timestamp
        );

        numTicks++;
    }

    function getTicks() external view returns (Tick[] memory) {
        Tick[] memory _ticks = new Tick[](numTicks);
        for (uint256 i = 0; i < numTicks; i++) {
            _ticks[i] = ticks[i];
        }
        return _ticks;
    }
}
