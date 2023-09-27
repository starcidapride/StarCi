import { ChainName, chainInfos } from '@utils/constant.utils'
import Web3, { HttpProvider, WebSocketProvider } from 'web3'

export const getHttpWeb3 = (chainName: ChainName) : Web3 => {
    const provider = new HttpProvider((chainInfos[chainName].httpRpcUrl))
    return new Web3(provider)
}

export const getWebsocketWeb3 = (chainName: ChainName) : Web3 => {
    const provider = new WebSocketProvider((chainInfos[chainName].websocketRpcUrl))
    return new Web3(provider)
}