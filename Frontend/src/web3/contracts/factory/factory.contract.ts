import Web3, { Address } from 'web3'
import abi from './factory.abi'
import { ChainName, chainInfos, gasLimit, gasPrice } from '@utils'
import { getHttpWeb3 } from '@web3/web3.utils'

export const getFactoryContract = (web3: Web3, chainName: ChainName) => {
    const factoryContract = chainInfos[chainName].factoryContract
    return new web3.eth.Contract(abi, factoryContract, web3)
}

export const getAllLiquidityPools = async (chainName: ChainName) => {
    const web3 = getHttpWeb3(chainName)
    const contract = getFactoryContract(web3, chainName)
    return await contract.methods.allLiquidityPools().call()

}

export const createLiquidityPool = async (
    web3: Web3, 
    chainName: ChainName,
    fromAddress: Address,
    _token0: Address,
    _token1: Address,
    _token0DepositAmount: string,
    _token1DepositAmount: string,
    _token0BasePrice: string,
    _token0MaxPrice: string,
    _protocolFee: string) => {
    const contract = getFactoryContract(web3, chainName)
    const data = contract.methods.createLiquidityPool(
        _token0,
        _token1,
        _token0DepositAmount,
        _token1DepositAmount,
        _token0BasePrice,
        _token0MaxPrice,
        _protocolFee   
    ).encodeABI()

    const to = chainInfos[chainName].factoryContract

    //const toAddress = chainInfos[chainName].factoryContract

    return await web3.eth.sendTransaction({
        from: fromAddress,
        to,
        data,
        gasLimit,
        gasPrice
    })
}
