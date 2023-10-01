import { ChainName, GAS_LIMIT, GAS_PRICE } from '@utils'
import Web3, { Address, Contract, Transaction } from 'web3'
import abi from './liquidity-pool.abi'
import { getHttpWeb3 } from '@web3'

export const getLiquidityPoolContract = (
    web3: Web3,
    liquidityPool: Address
): Contract<typeof abi> => new web3.eth.Contract(abi, liquidityPool, web3)

export const getToken0 = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<Address|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0().call()
    } catch (ex) {
        console.log(ex)
        return null
    }

}

export const getToken1 = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<Address|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1().call()
    } catch (ex) {
        console.log(ex)
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
export const getProps = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<LiquidityPoolProps|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const _queried = await liquidityPoolContract.methods.getProps().call()
        return {
            liquidityPool: contractAddress,
            token0: _queried.token0,
            token1: _queried.token1,
            token0Locked: _queried.token0Locked.toString(),
            token1Locked: _queried.token1Locked.toString()
        }
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0Output = async (
    chainName: ChainName,
    abortController: AbortController,
    contractAddress: Address,
    _token1Input: bigint
): Promise<bigint|null> => {
    try {
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0Output(_token1Input).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken1Output = async (
    chainName: ChainName,
    abortController: AbortController,
    contractAddress: Address,
    _token0Input: bigint
): Promise<bigint|null> => {
    try {
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1Output(_token0Input).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const swap = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amountTokenIn: bigint,
    _minAmountTokenOut: bigint,
    _isBuy: boolean
): Promise<Transaction|null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.swap(
            _amountTokenIn,
            _minAmountTokenOut,
            _isBuy
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0Constant = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0Constant().call()
    } catch (ex) {
        console.log(ex)
        return null
    }

}

export const getToken1Constant = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1Constant().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}
