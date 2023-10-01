import { ChainName, gasLimit, gasPrice } from '@utils'
import Web3, { Address } from 'web3'
import abi from './liquidity-pool.abi'
import { getHttpWeb3 } from '@web3/web3.utils'

export const getLiquidityPoolContract = (web3: Web3, liquidityPool: Address) => {
    return new web3.eth.Contract(abi, liquidityPool, web3)
}

export const getToken0 = async (chainName: ChainName, liquidityPool: Address) => {
    try{ 
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return await liquidityPoolContract.methods.token0().call()
    } catch(ex){
        return null
    }

}

export const getToken1 = async (chainName: ChainName, liquidityPool: Address) => {
    try{
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return await liquidityPoolContract.methods.token1().call()
    } catch(ex){
        return null
    }   
}

export type LiquidityPoolProps = {
    liquidityPool: Address,
    token0: Address,
    token1: Address,
    token0Locked: string,
    token1Locked: string
}
export const getProps = async (chainName: ChainName, liquidityPool: Address) : Promise<LiquidityPoolProps | null> => {
    try{
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        const _queried = await liquidityPoolContract.methods.getProps().call()
        return {
            liquidityPool: liquidityPool,
            token0: _queried.token0,
            token1: _queried.token1,
            token0Locked: _queried.token0Locked.toString(),
            token1Locked: _queried.token1Locked.toString()
        }
    } catch(ex){
        console.log(ex)
        return null
    }   
}

export const getToken0Output = async (chainName: ChainName, abortController: AbortController, liquidityPool: Address, _token1Input: string) => {
    try{
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return (await liquidityPoolContract.methods.token0Output(_token1Input).call()).toString()
    } catch(ex){
        console.log(ex)
        return null
    }   
}

export const getToken1Output = async (chainName: ChainName, abortController: AbortController, liquidityPool: Address, _token0Input: string) => {
    try{
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return (await liquidityPoolContract.methods.token1Output(_token0Input).call()).toString()
    } catch(ex){
        console.log(ex)
        return null
    }   
}

export const swap = async (
    web3: Web3,
    chainName: ChainName, 
    fromAddress: Address,
    liquidityPool: Address, 
    _amountTokenIn: string,
    _minAmountTokenOut: string,
    _isBuy: boolean
) => {
    try{
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
       
        const data = liquidityPoolContract.methods.swap(
            _amountTokenIn,
            _minAmountTokenOut,
            _isBuy
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: liquidityPool,
            data,
            gasLimit,
            gasPrice
        })
    } catch(ex){
        console.log(ex)
        return null
    }   
}

export const getToken0Constant = async (chainName: ChainName, liquidityPool: Address) => {
    try{ 
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return await liquidityPoolContract.methods.token0Constant().call()
    } catch(ex){
        return null
    }

}

export const getToken1Constant = async (chainName: ChainName, liquidityPool: Address) => {
    try{
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, liquidityPool)
        return await liquidityPoolContract.methods.token1Constant().call()
    } catch(ex){
        return null
    }   
}
