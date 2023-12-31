const abi = [
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '_factory',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': '_factoryOwner',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': '_token0',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': '_token1',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': '_token0DepositAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token1DepositAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token0BasePrice',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token0MaxPrice',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_protocolFee',
                'type': 'uint256'
            },
            {
                'internalType': 'string',
                'name': '_token1Name',
                'type': 'string'
            },
            {
                'internalType': 'string',
                'name': '_token1Symbol',
                'type': 'string'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'owner',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Approval',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'previousOwner',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'OwnershipTransferred',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'sender',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount0In',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount1In',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount0Out',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount1Out',
                'type': 'uint256'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            }
        ],
        'name': 'Swap',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'reserve0',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'reserve1',
                'type': 'uint256'
            }
        ],
        'name': 'Sync',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'value',
                'type': 'uint256'
            }
        ],
        'name': 'Transfer',
        'type': 'event'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'owner',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            }
        ],
        'name': 'allowance',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'approve',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'balanceOf',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'decimals',
        'outputs': [
            {
                'internalType': 'uint8',
                'name': '',
                'type': 'uint8'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'subtractedValue',
                'type': 'uint256'
            }
        ],
        'name': 'decreaseAllowance',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_amountToken1In',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_minAmountProfitableTokenOut',
                'type': 'uint256'
            }
        ],
        'name': 'depositTokens',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'name': 'depositorInfos',
        'outputs': [
            {
                'internalType': 'address',
                'name': 'depositor',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'factory',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'factoryOwner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '_address',
                'type': 'address'
            }
        ],
        'name': 'getDeposits',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'uint256',
                        'name': 'amountToken1In',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amountProfitableTokenOut',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'timestamp',
                        'type': 'uint256'
                    }
                ],
                'internalType': 'struct ProfitableTokenTick.DepositTick[]',
                'name': '',
                'type': 'tuple[]'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'getProps',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'address',
                        'name': 'token0',
                        'type': 'address'
                    },
                    {
                        'internalType': 'address',
                        'name': 'token1',
                        'type': 'address'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token0Holding',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token1Holding',
                        'type': 'uint256'
                    }
                ],
                'internalType': 'struct LiquidityPool.Props',
                'name': '',
                'type': 'tuple'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '_address',
                'type': 'address'
            }
        ],
        'name': 'getRewards',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'uint256',
                        'name': 'amountProfitableToken',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'timestamp',
                        'type': 'uint256'
                    }
                ],
                'internalType': 'struct ProfitableTokenTick.RewardTick[]',
                'name': '',
                'type': 'tuple[]'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'getTicks',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'uint256',
                        'name': 'amountToken0Locked',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amountToken1Locked',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'previousToken0Price',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token0Price',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amount0In',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amount1In',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amount0Out',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amount1Out',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'timestamp',
                        'type': 'uint256'
                    }
                ],
                'internalType': 'struct LPTick.Tick[]',
                'name': '',
                'type': 'tuple[]'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '_address',
                'type': 'address'
            }
        ],
        'name': 'getWithdrawals',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'uint256',
                        'name': 'amountProfitableTokenIn',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'amountToken1Out',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'timestamp',
                        'type': 'uint256'
                    }
                ],
                'internalType': 'struct ProfitableTokenTick.WithdrawTick[]',
                'name': '',
                'type': 'tuple[]'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'hasEarned',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'spender',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'addedValue',
                'type': 'uint256'
            }
        ],
        'name': 'increaseAllowance',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'interest',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'kConstant',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'maxRecords',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'name',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'owner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'protocolFee',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'renounceOwnership',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'startEarning',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_amountTokenIn',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_minAmountTokenOut',
                'type': 'uint256'
            },
            {
                'internalType': 'bool',
                'name': '_isBuy',
                'type': 'bool'
            }
        ],
        'name': 'swap',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'symbol',
        'outputs': [
            {
                'internalType': 'string',
                'name': '',
                'type': 'string'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'testKConstant',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token0',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token0BasePrice',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token0Constant',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token0DepositAmount',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token0MaxPrice',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_token1Input',
                'type': 'uint256'
            }
        ],
        'name': 'token0Output',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token1',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token1Constant',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'token1DepositAmount',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_token0Input',
                'type': 'uint256'
            }
        ],
        'name': 'token1Output',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [],
        'name': 'totalSupply',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'from',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'to',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'transferFrom',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'uint256',
                'name': '_amountProfitableTokenIn',
                'type': 'uint256'
            }
        ],
        'name': 'withdrawTokens',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function'
    }
] as const
export default abi