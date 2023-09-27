import Web3, { Address } from 'web3'

const KLAYTN_MAINNET_HTTP_RPC_URL = '...'
const KLAYTN_MAINNET_WEBSOCKET_RPC_URL = '...'
const KLAYTN_MAINNET_CONTRACT_FACTORY = '...'
const KLAYTN_MAINNET_USDT_CONTRACT = '...'
const KLAYTN_MAINNET_EXPLORER = ''

const KLAYTN_TESTNET_HTTP_RPC_URL = 'https://api.baobab.klaytn.net:8651'
const KLAYTN_TESTNET_WEBSOCKET_RPC_URL = 'wss://public-en-baobab.klaytn.net/ws'
const KLAYTN_TESTNET_CONTRACT_FACTORY = '0xFfe3d935B95b4E2cD1Aaa533b3AaE85F7AbfF05E'
const KLAYTN_TESTNET_USDT_CONTRACT = '0xEdEb5f63537EbAe7E6dD79D95Cd2EF20C75Cd732'
const KLAYTN_TESTNET_EXPLORER = 'https://baobab.klaytnscope.com/'

export enum ChainName {
    KlaytnMainnet,
    KalytnTestnet,
    PolygonMainnet,
    PolygonTestnet
}

type ChainInfo = {
    httpRpcUrl: string
    websocketRpcUrl: string
    factoryContract: Address
    stableCoins: Address[]
    explorer: string
}

export const chainInfos : Record<number, ChainInfo> = {
    [ChainName.KlaytnMainnet]: {
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl : KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryContract: KLAYTN_MAINNET_CONTRACT_FACTORY,
        stableCoins: [ KLAYTN_MAINNET_USDT_CONTRACT ],
        explorer: KLAYTN_MAINNET_EXPLORER
    },
    [ChainName.KalytnTestnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl : KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryContract: KLAYTN_TESTNET_CONTRACT_FACTORY,
        stableCoins: [ KLAYTN_TESTNET_USDT_CONTRACT ],
        explorer: KLAYTN_TESTNET_EXPLORER
    }
}

export const gasPrice = Web3.utils.toWei(25, 'gwei')
export const gasLimit = 3000000
