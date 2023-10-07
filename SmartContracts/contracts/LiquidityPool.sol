// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Factory.sol";
import "./LPTick.sol";
import "./ProfitableTokenTick.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LiquidityPool is LPTick, ProfitableTokenTick, ERC20, Ownable {
    address public factory;
    address public factoryOwner;

    address public token0;
    address public token1;

    uint256 public token0DepositAmount;
    uint256 public token1DepositAmount;

    // balance price constants
    uint256 public token0Constant;
    uint256 public token1Constant;

    uint256 public kConstant;

    // 1 token 0 (decimals) = how many token 1
    uint256 public token0BasePrice;
    uint256 public token0MaxPrice;

    uint256 public protocolFee;

    uint256 public interest;

    mapping(uint256 => address) providers;

    uint256 private numProviders;

    struct DepositorInfo {
        address depositor;
        uint256 amount;
    }
    DepositorInfo[] public depositorInfos;

    constructor(
        address _factory,
        address _factoryOwner,
        address _token0,
        address _token1,
        uint256 _token0DepositAmount,
        uint256 _token1DepositAmount,
        uint256 _token0BasePrice,
        uint256 _token0MaxPrice,
        uint256 _protocolFee,
        string memory _token1Name,
        string memory _token1Symbol
    ) LPTick() ProfitableTokenTick() ERC20(_token1Name, _token1Symbol) {
        factory = _factory;
        factoryOwner = _factoryOwner;

        require(_token0 != _token1, "Both tokens cannot be the same");
        token0 = _token0;
        token1 = _token1;

        token0DepositAmount = _token0DepositAmount;
        token1DepositAmount = _token1DepositAmount;

        require(
            _token0MaxPrice >= _token0BasePrice,
            "Maximum price must be greater than or equal to the base price"
        );
        token0BasePrice = _token0BasePrice;
        token0MaxPrice = _token0MaxPrice;

        protocolFee = _protocolFee;

        token0Constant = calcToken0Constant(
            _token0BasePrice,
            _token0MaxPrice,
            _token0DepositAmount
        );

        token1Constant = calcToken1Constant(
            _token0,
            _token0BasePrice,
            token0Constant,
            _token0DepositAmount,
            _token1DepositAmount
        );

        kConstant =
            (token0DepositAmount + token0Constant) *
            (token1DepositAmount + token1Constant);

        _generateTick(
            token0DepositAmount,
            token1DepositAmount,
            token0BasePrice,
            0,
            0,
            0,
            0
        );

        emit Sync(token0DepositAmount, token1DepositAmount);

        // interest 0.1% per transaction
        interest = 100;

        numProviders = 0;
    }

    function calcToken0Constant(
        uint256 _token0BasePrice,
        uint256 _token0MaxPrice,
        uint256 _token0DepositAmount
    ) internal pure returns (uint256) {
        uint256 ratio = SafeMath.div(_token0BasePrice * 10e17, _token0MaxPrice);
        uint256 sqrtRatio = Math.sqrt(ratio);

        uint256 numerator = sqrtRatio * _token0DepositAmount;
        uint256 denominator = 10e8 - sqrtRatio;

        return SafeMath.div(numerator, denominator);
    }

    function calcToken1Constant(
        address _token0,
        uint256 _token0BasePrice,
        uint256 _token0Constant,
        uint256 _token0DepositAmount,
        uint256 _token1DepositAmount
    ) internal view returns (uint256) {
        uint8 token0Decimals = ERC20(_token0).decimals();

        uint256 exponent = 10**token0Decimals;
        uint256 mulReturn = _token0BasePrice *
            (_token0DepositAmount + _token0Constant) -
            exponent *
            _token1DepositAmount;

        return SafeMath.div(mulReturn, exponent);
    }

    function _token0Balance() internal view returns (uint256) {
        return ERC20(token0).balanceOf(address(this));
    }

    function _actualToken0Balance() internal view returns (uint256) {
        return ERC20(token0).balanceOf(address(this)) + totalSupply();
    }

    function _token1Balance() internal view returns (uint256) {
        return ERC20(token1).balanceOf(address(this));
    }

    function _updateKConstant() internal {
        uint256 token0Balance = _actualToken0Balance();
        uint256 token1Balance = _token1Balance();
        kConstant =
            (token0Balance + token0Constant) *
            (token1Balance + token1Constant);
    }

    // testing only
    function testKConstant() external view returns (uint256) {
        uint256 token0Balance = _actualToken0Balance();
        uint256 token1Balance = _token1Balance();
        return
            (token0Balance + token0Constant) * (token1Balance + token1Constant);
    }

    function token1Output(uint256 _token0Input) public view returns (uint256) {
        uint256 token0Balance = _actualToken0Balance();
        uint256 token1Balance = _token1Balance();

        uint256 newToken0Balance = token0Balance + _token0Input;

        uint256 newToken1Balance = SafeMath.div(
            kConstant,
            (newToken0Balance + token0Constant)
        ) - token1Constant;

        return token1Balance - newToken1Balance;
    }

    function token0Output(uint256 _token1Input) public view returns (uint256) {
        uint256 token0Balance = _actualToken0Balance();
        uint256 token1Balance = _token1Balance();

        uint256 newToken1Balance = token1Balance + _token1Input;

        uint256 newToken0Balance = SafeMath.div(
            kConstant,
            (newToken1Balance + token1Constant)
        ) - token0Constant;

        return token0Balance - newToken0Balance;
    }

    struct Props {
        address token0;
        address token1;
        uint256 token0Holding;
        uint256 token1Holding;
    }

    function getProps() external view returns (Props memory) {
        Props memory _props = Props(
            token0,
            token1,
            _token0Balance(),
            _token1Balance()
        );

        return _props;
    }

    modifier isFactoryOwner() {
        require(msg.sender == factoryOwner, "Sender is not factory owner");
        _;
    }

    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );

    event Sync(uint256 reserve0, uint256 reserve1);

    function _buy(uint256 _amountToken1In, uint256 _minAmountToken0Out)
        internal
    {
        uint256 amountToken0Out = token0Output(_amountToken1In);

        require(
            amountToken0Out >= _minAmountToken0Out,
            "Insufficient output amount"
        );

        ERC20(token1).transferFrom(msg.sender, address(this), _amountToken1In);
        ERC20(token0).transfer(msg.sender, amountToken0Out);

        emit Swap(
            msg.sender,
            0,
            _amountToken1In,
            _minAmountToken0Out,
            0,
            address(this)
        );

        uint256 token0Balance = _token0Balance();
        uint256 token1Balance = _token1Balance();

        _generateTick(
            token0Balance,
            token1Balance,
            token1Output(10e17),
            0,
            _amountToken1In,
            _minAmountToken0Out,
            0
        );

        emit Sync(token0Balance, token1Balance);

        _addInterest(_amountToken1In);
    }

    function _sell(uint256 _amountToken0In, uint256 _minAmountToken1Out)
        internal
    {
        uint256 amountToken1Out = token1Output(_amountToken0In);

        require(
            amountToken1Out >= _minAmountToken1Out,
            "Insufficient output amount"
        );

        ERC20(token0).transferFrom(msg.sender, address(this), _amountToken0In);

        uint256 fee = SafeMath.div(protocolFee * amountToken1Out, 10e4);

        ERC20(token1).transfer(factoryOwner, fee);

        ERC20(token1).transfer(msg.sender, amountToken1Out - fee);

        emit Swap(
            msg.sender,
            _amountToken0In,
            0,
            0,
            _minAmountToken1Out,
            address(this)
        );

        uint256 token0Balance = _token0Balance();
        uint256 token1Balance = _token1Balance();

        _generateTick(
            token0Balance,
            token1Balance,
            token1Output(10e17),
            _amountToken0In,
            0,
            0,
            _minAmountToken1Out
        );

        emit Sync(token0Balance, token1Balance);
    }

    function swap(
        uint256 _amountTokenIn,
        uint256 _minAmountTokenOut,
        bool _isBuy
    ) public {
        if (_isBuy) {
            _buy(_amountTokenIn, _minAmountTokenOut);
        } else {
            _sell(_amountTokenIn, _minAmountTokenOut);
        }
    }

    function startEarning() external {
        if (numProviders == 0) {
            providers[0] = msg.sender;
            numProviders++;
            return;
        }
        for (uint256 i = 0; i < numProviders; i++) {
            if (providers[i] == msg.sender) {
                return;
            }
        }

        providers[numProviders] = msg.sender;
        numProviders++;
    }

    function hasEarned() external view returns (bool) {
        if (numProviders == 0) return false;
        for (uint256 i = 0; i < numProviders; i++) {
            if (providers[i] == msg.sender) return true;
        }
        return false;
    }

    function depositTokens(
        uint256 _amountToken1In,
        uint256 _minAmountProfitableTokenOut
    ) public {
        uint256 amountProfitableTokenOut = token0Output(_amountToken1In);

        require(
            amountProfitableTokenOut >= _minAmountProfitableTokenOut,
            "Insufficient output amount"
        );

        ERC20(token1).transferFrom(msg.sender, address(this), _amountToken1In);

        _mint(msg.sender, amountProfitableTokenOut);

        _updateKConstant();

        _generateDeposit(msg.sender, _amountToken1In, amountProfitableTokenOut);
    }

    function withdrawTokens(uint256 _amountProfitableTokenIn) public {
        uint256 fee = SafeMath.div(
            protocolFee * _amountProfitableTokenIn,
            10e4
        );

        transferFrom(msg.sender, address(this), _amountProfitableTokenIn);

        ERC20(token0).transferFrom(
            address(this),
            msg.sender,
            _amountProfitableTokenIn - fee
        );

        _mint(address(this), _amountProfitableTokenIn - fee);

        _generateWithdraw(
            msg.sender,
            _amountProfitableTokenIn,
            _amountProfitableTokenIn - fee
        );
    }

    function _addInterest(uint256 _amountToken1In) internal {
        if (numProviders == 0) return;

        for (uint256 i = 0; i < numProviders; i++) {
            uint256 LPTokenAmount = balanceOf(providers[i]);

            uint256 reward = SafeMath.div(
                _amountToken1In * LPTokenAmount * interest,
                (10e17 * 10e4)
            );

            _mint(providers[i], reward);

            _generateReward(providers[i], reward);
        }
    }
}
