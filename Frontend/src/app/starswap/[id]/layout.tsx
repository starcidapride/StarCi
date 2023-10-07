'use client'
import { useReducer, useEffect, createContext } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'
import {
    getToken0,
    getToken1,
    getSymbol,
    getDecimals,
    getBalance,
    getToken1Output,
    getToken0BasePrice,
    getToken0MaxPrice,
} from '@web3'
import {
    tokenReducer,
    initialTokenState,
    TokenState,
} from '@app/starswap/_context'
import { useParams } from 'next/navigation'
import { calcExponent, calcIRedenomination, calcRedenomination } from '@utils'

export const PoolAddressContext = createContext<string>('')
export const TokenContext = createContext<TokenState>(initialTokenState)

const ChildrenLayout = ({ children }: { children: React.ReactNode }) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName,
    )
    const account = useSelector((state: RootState) => state.blockchain.account)

    const [tokenState, tokenDispatch] = useReducer(
        tokenReducer,
        initialTokenState,
    )

    const params = useParams()
    const poolAddress = params.id as string

    useEffect(() => {
        const handleEffect = async () => {
            const _token0 = await getToken0(chainName, poolAddress)
            if (_token0 == null) return
            tokenDispatch({ type: 'SET_TOKEN0', payload: _token0 })

            const _token1 = await getToken1(chainName, poolAddress)
            if (_token1 == null) return
            tokenDispatch({ type: 'SET_TOKEN1', payload: _token1 })

            const _token0Symbol = await getSymbol(chainName, _token0)
            if (_token0Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol })

            const _token1Symbol = await getSymbol(chainName, _token1)
            if (_token1Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol })

            const _farmingTokenSymbol = await getSymbol(chainName, poolAddress)
            if (_farmingTokenSymbol == null) return
            tokenDispatch({
                type: 'SET_FARMING_TOKEN_SYMBOL',
                payload: _farmingTokenSymbol,
            })

            const _token0Decimals = await getDecimals(chainName, _token0)
            if (_token0Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals })

            const _token1Decimals = await getDecimals(chainName, _token1)
            if (_token1Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals })

            const _token0Price = await getToken1Output(
                chainName,
                poolAddress,
                BigInt(calcExponent(_token0Decimals)),
            )
            if (_token0Price == null) return
            tokenDispatch({
                type: 'SET_TOKEN0_PRICE',
                payload: calcRedenomination(_token0Price, _token1Decimals, 3),
            })

            const _token0BasePrice = await getToken0BasePrice(
                chainName,
                poolAddress
            )
            if (_token0BasePrice == null) return
            tokenDispatch({
                type: 'SET_TOKEN0_BASE_PRICE',
                payload: calcRedenomination(_token0BasePrice, _token1Decimals, 3),
            })

            const _token0MaxPrice = await getToken0MaxPrice(
                chainName,
                poolAddress
            )
            if (_token0MaxPrice == null) return
            tokenDispatch({
                type: 'SET_TOKEN0_MAX_PRICE',
                payload: calcRedenomination(_token0MaxPrice, _token1Decimals, 3),
            })

            const _farmingTokenDecimals = await getDecimals(chainName, poolAddress)
            if (_farmingTokenDecimals == null) return
            tokenDispatch({
                type: 'SET_FARMING_TOKEN_DECIMALS',
                payload: _farmingTokenDecimals,
            })

            tokenDispatch({ type: 'SET_FINISH_LOAD_WITHOUT_AUTH', payload: true })
        }
        handleEffect()
    }, [])

    useEffect(() => {
        if (account != '' && tokenState.finishLoadWithoutAuth) {
            console.log('called' + poolAddress)
            const handleEffect = async () => {
                const _token0Balance = await getBalance(
                    chainName,
                    tokenState.token0,
                    account,
                )
                if (_token0Balance == null) return
                tokenDispatch({
                    type: 'SET_TOKEN0_BALANCE',
                    payload: calcRedenomination(
                        _token0Balance,
                        tokenState.token0Decimals,
                        5,
                    ),
                })

                const _token1Balance = await getBalance(
                    chainName,
                    tokenState.token0,
                    account,
                )
                if (_token1Balance == null) return
                tokenDispatch({
                    type: 'SET_TOKEN1_BALANCE',
                    payload: calcRedenomination(
                        _token1Balance,
                        tokenState.token0Decimals,
                        5,
                    ),
                })

                const _farmingTokenBalance = await getBalance(
                    chainName,
                    poolAddress,
                    account,
                )
                if (_farmingTokenBalance == null) return
                tokenDispatch({
                    type: 'SET_FARMING_TOKEN_BALANCE',
                    payload: calcRedenomination(
                        _farmingTokenBalance,
                        tokenState.token0Decimals,
                        5,
                    ),
                })

                tokenDispatch({ type: 'SET_FINISH_LOAD_WITH_AUTH', payload: true })
            }
            handleEffect()
        }
    }, [account, tokenState.finishLoadWithoutAuth])

    console.log(tokenState)
    return (
        <PoolAddressContext.Provider value={poolAddress}>
            <TokenContext.Provider value={tokenState}>
                {children}
            </TokenContext.Provider>
        </PoolAddressContext.Provider>
    )
}

export default ChildrenLayout
