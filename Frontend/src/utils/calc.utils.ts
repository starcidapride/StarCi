export const calcExponent = (y: number): number => Math.pow(10, y)

export const calcRedenomination = (
    amount: bigint, 
    decimals: number, 
    round: number
) : number => {
    const divisor = calcExponent(decimals)
    return Number(amount * BigInt(calcExponent(round)) / BigInt(divisor)) 
    / calcExponent(round)
}

export const bDiv = (
    _a : bigint,
    _b : bigint,
    round: number
) : number => Number((_a * BigInt(calcExponent(round)) / _b)) / calcExponent(round)

export const calcIRedenomination = (
    amount: number, 
    decimals: number
): bigint => {
    return BigInt(amount * calcExponent(decimals))
}



export const calInverse = (
    y: number,
    round: number
) : number => 
{
    if (y == 0) return 0
    return Number.parseFloat((1/y).toFixed(round))
}

export const calcRound = (
    y: number, 
    round: number
) : number => Number(y.toFixed(round))