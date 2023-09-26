import Web3, { Address } from 'web3'
import erc20Abi from './erc20.abi'
import { ChainName } from '@utils/constant.utils'
import { getHttpWeb3 } from '@web3/web3.utils'

export const getErc20Contract = (web3: Web3, erc20Contract: Address) => new web3.eth.Contract(erc20Abi, erc20Contract, web3)

export const getName = async (chainName: ChainName, erc20Contract: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.name().call()
} 

export const getSymbol = async (chainName: ChainName, erc20Contract: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.symbol().call()
} 

export const getBalance = async (chainName: ChainName, erc20Contract: Address, _address: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.balanceOf(_address).call()
} 

export const getDecimals = async (chainName: ChainName, erc20Contract: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.decimals().call()
} 

export const getTotalSupply = async (chainName: ChainName, erc20Contract: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.totalSupply().call()
} 

export const isErc20 = async (chainName: ChainName, erc20Contract: Address | undefined) => {
    try {
        await getName(chainName, erc20Contract!)
        await getSymbol(chainName, erc20Contract!)
        return true
    } catch(ex){
        return false
    }
}
