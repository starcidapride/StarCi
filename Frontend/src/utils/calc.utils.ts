import { MatchPrimitiveType } from 'web3'

export const calcExponent = (y: number) => Math.pow(10, y)

export const calcBalance = (balance: MatchPrimitiveType<'uint256', unknown>, decimals: MatchPrimitiveType<'uint8', unknown>, round: number) => {
    const _balance = Number.parseInt(balance.toString()) 
    / calcExponent(Number.parseInt(decimals.toString()))
    const roundedResult = _balance.toFixed(round)
    return Number.parseFloat(roundedResult)
}

export const calInverse = (y: number, round: number) => 
{
    if (y == 0) return 0
    return Number.parseFloat((1/y).toFixed(round))
}

export const calcRound = (y: number, round: number) => Number.parseFloat(y.toFixed(round))