// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Factory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable {
    address public factory;
    address public factoryOwner;

    address public token0;
    address public token1;
    
    uint public token0MaxAmount;
    uint public token1MaxAmount;

    uint public token1MinPrice;
    uint public token1MaxPrice;

    uint public protocolFee;
    uint public liquidity;

    constructor(
        address _token0,
        address _token1,
        uint _token0MaxAmount,
        uint _token1MaxAmount,
        uint _token1MinPrice,
        uint _token1MaxPrice,
        uint _protocolFee,
        address _factory
    ) {
        token0 = _token0;
        token1 = _token1;

        token0MaxAmount = _token0MaxAmount;
        token1MaxPrice = _token1MaxAmount;

        token1MinPrice = _token1MinPrice;
        token1MaxPrice = _token1MaxPrice;

        protocolFee = _protocolFee;

        Factory factoryContract = Factory(_factory);
        factoryOwner = factoryContract.owner();

       // setLiquidityConstant();
    }

    // function setLiquidityConstant() internal {
    //     uint X = maxAmountToken0 * token1Price / maxAdditionalToken1Price;
    //     liquidityConstant = X * (token1Price + maxAdditionalToken1Price);
    // }
    

    // modifier isFactoryOwner() {
    //     require(msg.sender == factoryOwner, "Sender is not factory owner.");
    //     _;
    // }


    // function setToken1Price(uint _token1Price) external isFactoryOwner() {
    //     token1Price = _token1Price;
    //     setLiquidityConstant();
    // }

    // function setMaxAmountToken0(uint _maxAmountToken0) external isFactoryOwner() {
    //     maxAmountToken0 = _maxAmountToken0;
    //     setLiquidityConstant();
    // }

    // function calculateAmountToken0Out(uint amountToken1In) public view returns (uint){
    //     uint X = maxAmountToken0 * token1Price / maxAdditionalToken1Price;

    //     uint amountToken0 = ERC20(token0).balanceOf(address(this));
    //     uint amountToken1 = ERC20(token1).balanceOf(address(this));

    //     require(amountToken1 >= amountToken1In, "Insufficient amount of token 1.");

    //     uint afterAmountToken1 = amountToken1 - amountToken1In;
    //     uint afterAmountToken0 = liquidityConstant/ (X + afterAmountToken1);

    //     return amountToken0 - afterAmountToken0;
    // }

    // event RecordSwap (
    //     address indexed pool,
    //     uint updatedAmountToken0,
    //     uint updatedAmountToken1,
    //     uint updatedToken1Price,
    //     uint timestamp
    // );

    // function buy(uint amountToken1In, uint minAmountToken0Out) external {
    //     require(IERC20(token1).allowance(msg.sender, address(this)) >= amountToken1In, "Allowance not set for the contract.");

    //     uint amountToken0Out = calculateAmountToken0Out(amountToken1In);
    //     require(amountToken0Out >= minAmountToken0Out, "Received amount of token 0 is below the expected minimum.");

    //     uint tokenFee = amountToken1In * protocolFee / 10e5;
    //     IERC20(token1).transferFrom(msg.sender, factoryOwner, tokenFee);
    //     IERC20(token1).transferFrom(msg.sender, address(this), amountToken1In - tokenFee);

    //     IERC20(token0).transfer(msg.sender, amountToken0Out);

    //     uint amountToken0 = ERC20(token0).balanceOf(address(this));
    //     uint amountToken1 = ERC20(token1).balanceOf(address(this));

    //     emit RecordSwap(
    //         address(this),
    //         amountToken0,
    //         amountToken1,
    //         amountToken0Out / amountToken1In,
    //         block.timestamp
    //     );
    // }
}
