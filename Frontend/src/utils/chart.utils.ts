import { EventLog } from 'web3-eth-contract'
import { getHttpWeb3 } from '@web3'
import { bDiv, calcRedenomination } from './calc.utils'
import { ChainName } from './blockchain.utils'

export type ChartTick = {
    token0: number,
    token1: number,
    token0Price: number,
    time: Date
}

export const convertSyncEvent = async (
    event: EventLog,
    chainName: ChainName,
    token0Decimals: number,
    token1Decimals: number,
    token0Constant: bigint, 
    token1Constant: bigint,
) : Promise<ChartTick> => {

    const reserve1 = event.returnValues[0] as bigint
    const reserve2 = event.returnValues[1] as bigint
    const web3 = getHttpWeb3(chainName)
    const token0 = calcRedenomination(reserve1, token0Decimals, 5)
    const token1 = calcRedenomination(reserve2, token1Decimals, 5)
    const block = await web3.eth.getBlock(event.blockHash)
    const time = new Date(Number(block.timestamp) * 1000)
    
    const token0Price = bDiv(reserve1 + token1Constant, reserve2 + token0Constant, 5)

    return {
        token0,
        token1,
        token0Price,
        time 
    }
}
