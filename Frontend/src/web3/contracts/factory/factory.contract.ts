import Web3, { Address, Transaction } from 'web3'
import abi from './factory.abi'
import { ChainName, chainInfos, GAS_PRICE, GAS_LIMIT } from '@utils'
import { getHttpWeb3 } from '@web3'

export const getFactoryContract = (chainName: ChainName) => {
    const web3 = getHttpWeb3(chainName)
    const factoryContract = chainInfos[chainName].factoryContract
    return new web3.eth.Contract(abi, factoryContract, web3)
}

export const getAllLiquidityPools = async (chainName: ChainName) : Promise<Address[]|null> => {
    try{
        const contract = getFactoryContract(chainName)
        
        return await contract.methods.allLiquidityPools().call()
    } catch(ex){
        console.log(ex)
        return null
    }


}

export const createLiquidityPool = async (
    web3: Web3, 
    chainName: ChainName,
    fromAddress: Address,
    _token0: Address,
    _token1: Address,
    _token0DepositAmount: bigint,
    _token1DepositAmount: bigint,
    _token0BasePrice: bigint,
    _token0MaxPrice: bigint,
    _protocolFee: bigint
) : Promise<Transaction|null>  => {
    try{
        const contract = getFactoryContract(chainName)
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

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice : GAS_PRICE
        })
    } catch(ex){
        console.log(ex)
        return null
    }
}
