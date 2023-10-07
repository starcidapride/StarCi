// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract ProfitableTokenTick {
    struct RewardTick {
        uint256 amountProfitableToken;
        uint timestamp;
    }

    struct DepositTick {
        uint256 amountToken1In;
        uint256 amountProfitableTokenOut;
        uint timestamp;
    }

    struct WithdrawTick {
        uint256 amountProfitableTokenIn;
        uint256 amountToken1Out;
        uint timestamp;
    }

    mapping(address => mapping(uint => RewardTick)) rewardTicks;
    mapping(address => mapping(uint => DepositTick)) depositTicks;
    mapping(address => mapping(uint => WithdrawTick)) withdrawTicks;

    uint256 private numRewards;
    uint256 private numDeposits;
    uint256 private numWithdraws;

    uint256 public maxRecords;

    constructor() {
        numRewards = 0;
        numDeposits = 0;
        numWithdraws = 0;
    }

    function _generateReward(
        address _address,
        uint256 amountProfitableToken
    ) internal {
        rewardTicks[_address][numRewards] = RewardTick(
            amountProfitableToken,
            block.timestamp
        );
        numRewards++;
    }

    function _generateDeposit(
        address _address,
        uint256 _amountToken1In,
        uint256 _amountProfitableTokenOut
    ) internal {
        depositTicks[_address][numDeposits] = DepositTick(
            _amountToken1In,
            _amountProfitableTokenOut,
            block.timestamp
        );
        numDeposits++;
    }

    function _generateWithdraw(
        address _address,
        uint256 _amountProfitableTokenIn,
        uint256 _amountToken0Out
    ) internal {
        withdrawTicks[_address][numWithdraws] = WithdrawTick(
            _amountProfitableTokenIn,
            _amountToken0Out,
            block.timestamp
        );

        numWithdraws++;
    }

    function getRewards(address _address) external view returns (RewardTick[] memory) {
        RewardTick[] memory _rewards = new RewardTick[](numRewards);
        for (uint256 i = 0; i < numRewards; i++) {
            _rewards[i] = rewardTicks[_address][i];
        }
        return _rewards;
    }

    function getDeposits(address _address) external view returns (DepositTick[] memory) {
        DepositTick[] memory _deposits = new DepositTick[](numDeposits);
        for (uint256 i = 0; i < numDeposits; i++) {
            _deposits[i] = depositTicks[_address][i];
        }
        return _deposits;
    }

    function getWithdrawals(address _address) external view returns (WithdrawTick[] memory) {
        WithdrawTick[] memory _withdrawals = new WithdrawTick[](numWithdraws);
        for (uint256 i = 0; i < numWithdraws; i++) {
            _withdrawals[i] = withdrawTicks[_address][i];
        }
        return _withdrawals;
    }
}