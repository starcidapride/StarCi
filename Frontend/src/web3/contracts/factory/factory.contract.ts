import Web3, { Address } from 'web3'
import abi from './factory.abi'
import { ChainName, chainInfos, gasLimit, gasPrice } from '@utils/constant.utils'

export const getFactoryContract = (web3: Web3, chainName: ChainName) => {
    const factoryContract = chainInfos[chainName].factoryContract
    console.log(factoryContract)
    return new web3.eth.Contract(abi, factoryContract, web3)
}

export const createLiquidityPool = async (
    web3: Web3, 
    chainName: ChainName,
    fromAddress: Address,
    _token0: Address,
    _token1: Address,
    _token0MaxAmount: string,
    _token1MaxAmount: string,
    _token1MinPrice: string,
    _token1MaxPrice: string,
    _protocolFee: string) => {
    const contract = getFactoryContract(web3, chainName)
    const data = contract.methods.createLiquidityPool(
        _token0,
        _token1,
        _token0MaxAmount,
        _token1MaxAmount,
        _token1MinPrice,
        _token1MaxPrice,
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
