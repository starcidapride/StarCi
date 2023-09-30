import { ChainName, chainInfos } from '@utils'
import Web3, { HttpProvider, WebSocketProvider } from 'web3'

export const getHttpWeb3 = (chainName: ChainName, abortController?: AbortController) : Web3 => {

    const _providerOptions = abortController
        ? {
            providerOptions: {
                signal: abortController.signal
            }
        } : undefined
    
    const provider = new HttpProvider(chainInfos[chainName].httpRpcUrl, _providerOptions)
    return new Web3(provider)
}

export const getWebsocketWeb3 = (chainName: ChainName) : Web3 => {
    const provider = new WebSocketProvider((chainInfos[chainName].websocketRpcUrl))
    return new Web3(provider)
}