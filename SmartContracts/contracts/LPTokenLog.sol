// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract LPTokenLog {
    struct RewardLog {
        uint256 amount;
        uint timestamp;
    }

    struct DepositLog {
        uint256 amount;
        uint timestamp;
    }

    struct WithdrawLog {
        uint256 amount;
        uint timestamp;
    }

    mapping(address => mapping(uint => RewardLog)) rewardLogs;
    mapping(address => mapping(uint => DepositLog)) depositLogs;
    mapping(address => mapping(uint => WithdrawLog)) withdrawLogs;

    uint256 private rewardBeginIndex;
    uint256 private rewardEndIndex;
    uint256 private depositBeginIndex;
    uint256 private depositEndIndex;
    uint256 private withdrawBeginIndex;
    uint256 private withdrawEndIndex;

    uint256 public maxRecords;

    constructor(uint256 _maxRecords) {
        rewardBeginIndex = 0;
        rewardEndIndex = 0;
        depositBeginIndex = 0;
        depositEndIndex = 0;
        withdrawBeginIndex = 0;
        withdrawEndIndex = 0;
        maxRecords = _maxRecords;
    }

    function _generateReward(
        address _address,
        uint256 _amount
    ) internal {
        if (rewardEndIndex - rewardBeginIndex == maxRecords) {
            delete rewardLogs[_address][rewardBeginIndex];
            rewardBeginIndex++;
        }

        rewardEndIndex++;

        rewardLogs[_address][rewardEndIndex] = RewardLog(
            _amount,
            block.timestamp
        );
    }

    function _generateDeposit(
        address _address,
        uint256 _amount
    ) internal {
        if (depositEndIndex - depositBeginIndex == maxRecords) {
            delete depositLogs[_address][depositBeginIndex];
            depositBeginIndex++;
        }

        depositEndIndex++;

        depositLogs[_address][depositEndIndex] = DepositLog(
            _amount,
            block.timestamp
        );
    }

    function _generateWithdraw(
        address _address,
        uint256 _amount
    ) internal {
        if (withdrawEndIndex - withdrawBeginIndex == maxRecords) {
            delete withdrawLogs[_address][withdrawBeginIndex];
            withdrawBeginIndex++;
        }

        withdrawEndIndex++;

        withdrawLogs[_address][withdrawEndIndex] = WithdrawLog(
            _amount,
            block.timestamp
        );
    }

    function getRewards(address _address) external view returns (RewardLog[] memory) {
        RewardLog[] memory _rewards = new RewardLog[](rewardEndIndex - rewardBeginIndex + 1);
        for (uint256 i = rewardBeginIndex; i < rewardEndIndex + 1; i++) {
            _rewards[i - rewardBeginIndex] = rewardLogs[_address][i];
        }
        return _rewards;
    }

    function getDeposits(address _address) external view returns (DepositLog[] memory) {
        DepositLog[] memory _deposits = new DepositLog[](depositEndIndex - depositBeginIndex + 1);
        for (uint256 i = depositBeginIndex; i < depositEndIndex + 1; i++) {
            _deposits[i - depositBeginIndex] = depositLogs[_address][i];
        }
        return _deposits;
    }

    function getWithdrawals(address _address) external view returns (WithdrawLog[] memory) {
        WithdrawLog[] memory _withdrawals = new WithdrawLog[](withdrawEndIndex - withdrawBeginIndex + 1);
        for (uint256 i = withdrawBeginIndex; i < withdrawEndIndex + 1; i++) {
            _withdrawals[i - withdrawBeginIndex] = withdrawLogs[_address][i];
        }
        return _withdrawals;
    }
}