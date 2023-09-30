import { MatchPrimitiveType } from 'web3'

export const calcExponent = (y: number) => Math.pow(10, y)

export const calcRedenomination = (
    amount: MatchPrimitiveType<'uint256', unknown>, 
    decimals: MatchPrimitiveType<'uint8', unknown>, 
    round: number) => {
    const _amount = Number.parseInt(amount.toString()) 
    / calcExponent(Number.parseInt(decimals.toString()))
    const roundedResult = _amount.toFixed(round)
    return Number.parseFloat(roundedResult)
}

export const calInverse = (y: number, round: number) => 
{
    if (y == 0) return 0
    return Number.parseFloat((1/y).toFixed(round))
}

export const calcRound = (y: number, round: number) => {
    try{
        return Number.parseFloat(y.toFixed(round))
    } catch (ex){
        return 0
    }
}

export const calcInt = (
    n: MatchPrimitiveType<'uint256', unknown>
) => Number.parseInt(n.toString())

export const calcNRedenomination = (
    amount: number | string, 
    decimals: MatchPrimitiveType<'uint8', unknown>
) => {
    try {
        return (Number.parseFloat(amount.toString()) 
        * calcExponent(Number.parseInt(decimals.toString())))
            .toString()
    } catch(ex){
        return null
    }

}
