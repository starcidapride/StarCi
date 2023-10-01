import { EventLog } from 'web3-eth-contract'
import { bDiv, calcRedenomination } from './calc.utils'

export type ChartTick = {
    token0: number,
    token1: number,
    token0Price: number,
}

export const convertSyncEvent =  (
    event: EventLog,
    token0Decimals: number,
    token1Decimals: number,
    token0Constant: bigint, 
    token1Constant: bigint,

) : ChartTick => {

    const reserve1 = event.returnValues[0] as bigint
    const reserve2 = event.returnValues[1] as bigint

    const token0 = calcRedenomination(reserve1, token0Decimals, 5)
    const token1 = calcRedenomination(reserve2, token1Decimals, 5)
    
    const token0Price = bDiv(reserve2 + token1Constant, reserve1 + token0Constant, 5)

    return {
        token0,
        token1,
        token0Price
    }
}
