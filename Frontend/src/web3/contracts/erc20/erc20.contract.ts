import Web3, { Address, Transaction } from 'web3'
import abi from './erc20.abi'
import { ChainName, GAS_LIMIT, GAS_PRICE } from '@utils'
import { getHttpWeb3 } from '@web3'

export const getErc20Contract = (web3: Web3, erc20Contract: Address) => new web3.eth.Contract(abi, erc20Contract, web3)

export const getName = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<Address | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        return await _erc20Contract.methods.name().call()
    } catch (ex) {
        console.log(ex)
        return null
    }

}

export const getSymbol = async (
    chainName: ChainName,
    contractAddress: Address,
    abortController?: AbortController
): Promise<string | null> => {
    try {
        const web3 = getHttpWeb3(chainName, abortController)
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        return await _erc20Contract.methods.symbol().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getBalance = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        return await _erc20Contract.methods.balanceOf(_address).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getDecimals = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<number | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        return Number(await _erc20Contract.methods.decimals().call())
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getTotalSupply = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        return await _erc20Contract.methods.totalSupply().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getAllowance = async (
    chainName: ChainName,
    erc20Contract: Address,
    _owner: Address,
    _splender: Address
):Promise<bigint|null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const _erc20Contract = getErc20Contract(web3, erc20Contract)
        return await _erc20Contract.methods.allowance(_owner, _splender).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const approve = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _splender: Address,
    _amount: bigint
):Promise<Transaction|null> => {
    try {
        const _erc20Contract = getErc20Contract(web3, contractAddress)
        const data = _erc20Contract.methods.approve(
            _splender,
            _amount
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch(ex){
        console.log(ex)
        return null
    }
}
