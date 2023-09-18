// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ILiquidityPool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is ILiquidityPool, Ownable {
    address public token0;
    address public token1;
    uint public exchangeRate;
    

}