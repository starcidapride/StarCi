import Web3, { Address } from 'web3'
import erc20Abi from './erc20.abi'
import { ChainName, gasLimit, gasPrice } from '@utils'
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

export const getAllowance = async (chainName: ChainName, erc20Contract: Address, _owner: Address, _splender: Address) => {
    const web3 = getHttpWeb3(chainName)
    const _erc20Contract = getErc20Contract(web3, erc20Contract)
    return await _erc20Contract.methods.allowance(_owner, _splender).call()
} 

export const approve = async (   
    web3: Web3, 
    fromAddress: Address,
    contractAddress: Address,
    _splender: Address,
    _amount : string
) => {
    const _erc20Contract = getErc20Contract(web3, contractAddress) 
    const data = _erc20Contract.methods.approve(
        _splender,
        _amount
    ).encodeABI()

    //const toAddress = chainInfos[chainName].factoryContract

    return await web3.eth.sendTransaction({
        from: fromAddress,
        to: contractAddress,
        data,
        gasLimit,
        gasPrice
    })
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
