import { ChainName } from '@utils/constant.utils'
import Web3, { Address } from 'web3'
import abi from './liquidity-pool.abi'
import { getHttpWeb3 } from '@web3/web3.utils'

export const getLiquidityPoolContract = (web3: Web3, chainName: ChainName, liquidityPool: Address) => {
    return new web3.eth.Contract(abi, liquidityPool, web3)
}

export const getToken0 = async (chainName: ChainName, liquidityPool: Address) => {
    try{ 
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, chainName, liquidityPool)
        return await liquidityPoolContract.methods.token0().call()
    } catch(ex){
        return null
    }

}

export const getToken1 = async (chainName: ChainName, liquidityPool: Address) => {
    try{
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, chainName, liquidityPool)
        return await liquidityPoolContract.methods.token1().call()
    } catch(ex){
        return null
    }
}
