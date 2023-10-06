// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LiquidityPool.sol";

contract Factory is Ownable {
    LiquidityPool[] public liquidityPools;


    event CreateLiquidityPool (
        address indexed creator,
        address indexed liquidityPool
    );

    function createLiquidityPool  (
        address _token0,
        address _token1,
        uint _token0DepositAmount,
        uint _token1DepositAmount,
        uint _token0BasePrice,
        uint _token0MaxPrice,
        uint _protocolFee
    ) public {
        string memory LPTokenName = ERC20(_token1).name();
        string memory LPTokenSymbol = ERC20(_token1).symbol();

        string memory _profitableTokenName = string.concat("Profitable ", LPTokenName);
        string memory _profitableTokenSymbol = string.concat("pr", LPTokenSymbol);

        LiquidityPool liquidityPool = new LiquidityPool(
            address(this),
            owner(),
            _token0,
            _token1,
            _token0DepositAmount,
            _token1DepositAmount,
            _token0BasePrice,
            _token0MaxPrice,
            _protocolFee,
            _profitableTokenName,
            _profitableTokenSymbol
        );

        liquidityPool.transferOwnership(msg.sender);

        ERC20(_token0).transferFrom(msg.sender, address(liquidityPool), _token0DepositAmount);
        ERC20(_token1).transferFrom(msg.sender, address(liquidityPool), _token1DepositAmount);

        liquidityPools.push(liquidityPool);

        emit CreateLiquidityPool(
            msg.sender, 
            address(liquidityPool)
            );
    }

    function allLiquidityPools() external view returns (address[] memory){
        uint256 length = liquidityPools.length;
        address[] memory poolAddresses = new address[](length);

        for (uint256 i = 0; i < length; i++) {
            poolAddresses[i] = address(liquidityPools[i]);
        }

        return poolAddresses;
    }
}
