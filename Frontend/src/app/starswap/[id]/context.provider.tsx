'use client'
import { ReactNode, createContext, useEffect, useReducer } from 'react'
import { TokenState, initialTokenState, tokenReducer } from '../_extras'
import { getDecimals, getSymbol, getToken0, getToken1 } from '@web3'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'

export const Context = createContext<TokenState>(initialTokenState)

interface ContextProviderProps {
    children: React.ReactNode;
    poolAddress: string; // Tham số mới
}

const ContextProvider = (props: ContextProviderProps) => {


    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

    useEffect(() => {
        const handleEffect = async () => {
            const _token0 = await getToken0(chainName, props.poolAddress)
            if (_token0 == null) return
            tokenDispatch({ type: 'SET_TOKEN0', payload: _token0 })
    
            const _token1 = await getToken1(chainName, props.poolAddress)
            if (_token1 == null) return
            tokenDispatch({ type: 'SET_TOKEN1', payload: _token1 })
    
            const _token0Symbol = await getSymbol(chainName, _token0)
            if (_token0Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol })
    
            const _token1Symbol = await getSymbol(chainName, _token1)
            if (_token1Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol })
    
            const _token0Decimals = await getDecimals(chainName, _token0)
            if (_token0Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals })
    
            const _token1Decimals = await getDecimals(chainName, _token1)
            if (_token1Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals })
    
            tokenDispatch({type : 'SET_FINISH_LOAD_WITHOUT_AUTH', payload: true})
        }
        handleEffect()
    }, []
    )

    return (
        <Context.Provider value={tokenState}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider