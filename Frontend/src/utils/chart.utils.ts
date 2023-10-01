import { EventLog } from 'web3-eth-contract'
import { getHttpWeb3 } from '@web3/web3.utils'
import { ChainName, calcRedenomination } from '.'

export type ChartItemData = {
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
    token0Constant: number, 
    token1Constant: number,
) : Promise<ChartItemData> => {

    const web3 = getHttpWeb3(chainName)
    const token0 = calcRedenomination(Number(event.returnValues[0] as bigint), token0Decimals, 5)!
    const token1 = calcRedenomination(Number(event.returnValues[1] as bigint), token1Decimals, 5)!
    const block = await web3.eth.getBlock(event.blockHash)
    const time = new Date(Number(block.timestamp) * 1000)
    
    const token0Price = (token1 + token1Constant) / (token0 + token0Constant)

    return {
        token0,
        token1,
        token0Price,
        time 
    }
}
