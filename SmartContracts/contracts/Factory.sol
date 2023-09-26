// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidityPool.sol";

contract Factory is Ownable {
    LiquidityPool[] public liquidityPools;
    
    event LiquidityPoolCreated (
        address indexed creator,
        address indexed liquidityPool
    );

    function createLiquidityPool  (
        address _token0,
        address _token1,
        uint _token0MaxAmount,
        uint _token1MaxAmount,
        uint _token1MinPrice,
        uint _token1MaxPrice,
        uint _protocolFee
    ) public {
        LiquidityPool liquidityPool = new LiquidityPool(
            _token0,
            _token1,
            _token0MaxAmount,
            _token1MaxAmount,
            _token1MinPrice,
            _token1MaxPrice,
            _protocolFee,
            address(this)
        );

        liquidityPool.transferOwnership(msg.sender);

        liquidityPools.push(liquidityPool);

        emit LiquidityPoolCreated(
            msg.sender, 
            address(liquidityPool)
            );
    }
}
