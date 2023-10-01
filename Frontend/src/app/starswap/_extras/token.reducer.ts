export type TokenState = {
    token0: string
    token1: string
    token0Balance: number
    token1Balance: number
    token0Symbol: string
    token1Symbol: string
    token0Decimals: number
    token1Decimals: number
    token0Constant: bigint
    token1Constant: bigint
}

export interface SetTokenAction {
    type: 'SET_TOKEN0' | 'SET_TOKEN1'
    payload: string
}

export interface SetTokenBalanceAction {
    type: 'SET_TOKEN0_BALANCE' | 'SET_TOKEN1_BALANCE'
    payload: number
}

export interface SetTokenSymbolAction {
    type: 'SET_TOKEN0_SYMBOL' | 'SET_TOKEN1_SYMBOL'
    payload: string
}

export interface SetTokenDecimalsAction {
    type: 'SET_TOKEN0_DECIMALS' | 'SET_TOKEN1_DECIMALS'
    payload: number
}

export interface SetTokenConstantAction {
    type: 'SET_TOKEN0_CONSTANT' | 'SET_TOKEN1_CONSTANT'
    payload: bigint
}


export type TokenAction = SetTokenAction | SetTokenBalanceAction | SetTokenSymbolAction | SetTokenDecimalsAction | SetTokenConstantAction

export const initialTokenState: TokenState = {
    token0: '',
    token1: '',
    token0Balance: 0,
    token1Balance: 0,
    token0Symbol: '',
    token1Symbol: '',
    token0Decimals: 0,
    token1Decimals: 0,
    token0Constant: BigInt(0),
    token1Constant: BigInt(0)
}

export const tokenReducer = (
    state: TokenState,
    action: TokenAction
) => {
    switch (action.type) {
    case 'SET_TOKEN0':
        return {
            ...state,
            token0: action.payload
        }
    case 'SET_TOKEN1':
        return {
            ...state,
            token1: action.payload
        }
    case 'SET_TOKEN0_BALANCE':
        return {
            ...state,
            token0Balance: action.payload
        }
    case 'SET_TOKEN1_BALANCE':
        return {
            ...state,
            token1Balance: action.payload
        }
    case 'SET_TOKEN0_SYMBOL':
        return {
            ...state,
            token0Symbol: action.payload
        }
    case 'SET_TOKEN1_SYMBOL':
        return {
            ...state,
            token1Symbol: action.payload
        }
    case 'SET_TOKEN0_DECIMALS':
        return {
            ...state,
            token0Decimals: action.payload
        }
    case 'SET_TOKEN1_DECIMALS':
        return {
            ...state,
            token1Decimals: action.payload
        }
    case 'SET_TOKEN0_CONSTANT':
        return {
            ...state,
            token0Constant: action.payload
        }
    case 'SET_TOKEN1_CONSTANT':
        return {
            ...state,
            token1Constant:  action.payload
        }
    default:
        return state
    }
}

