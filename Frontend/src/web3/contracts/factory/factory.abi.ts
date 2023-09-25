const abi = [
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'creator',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'liquidityPool',
                'type': 'address'
            }
        ],
        'name': 'LiquidityPoolCreated',
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
        'inputs': [
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
                'name': '_token0MaxAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token1MaxAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token1MinPrice',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_token1MaxPrice',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': '_protocolFee',
                'type': 'uint256'
            }
        ],
        'name': 'createLiquidityPool',
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
        'name': 'liquidityPools',
        'outputs': [
            {
                'internalType': 'contract LiquidityPool',
                'name': '',
                'type': 'address'
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
        'name': 'renounceOwnership',
        'outputs': [],
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
    }
] as const
export default abi