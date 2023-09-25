import Web3, { Address } from 'web3'
import abi from './factory.abi'
import { ChainName, chainInfos, gasLimit, gasPrice } from '@utils/constant.utils'

export const getFactoryContract = (web3: Web3, chainName: ChainName) => {
    const factoryContract = chainInfos[chainName].factoryContract
    return new web3.eth.Contract(abi, factoryContract, web3)
}

export const createLiquidityPool = async (
    web3: Web3, 
    chainName: ChainName,
    fromAddress: Address,
    _token0: Address,
    _token1: Address,
    _token0MaxAmount: bigint,
    _token1MaxAmount: bigint,
    _token1MinPrice: bigint,
    _token1MaxPrice: bigint,
    _protocolFee: bigint) => {
    const contract = getFactoryContract(web3, chainName)
    const data = contract.methods.createLiquidityPool(
        _token0,
        _token1,
        _token0MaxAmount.toString(),
        _token1MaxAmount.toString(),
        _token1MinPrice.toString(),
        _token1MaxPrice.toString(),
        _protocolFee.toString()   
    ).encodeABI()

    //const toAddress = chainInfos[chainName].factoryContract

    web3.eth.sendTransaction({
        from: fromAddress,
        data,
        gasLimit,
        gasPrice
    })
}
