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
                        'name': 'token0Locked',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token1Locked',
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
        'inputs': [],
        'name': 'getTicks',
        'outputs': [
            {
                'components': [
                    {
                        'internalType': 'uint256',
                        'name': 'token0',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token1',
                        'type': 'uint256'
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'token0Price',
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
        'name': 'maxTicks',
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
    }
] as const
export default abi