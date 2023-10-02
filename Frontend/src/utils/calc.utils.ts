export const calcExponent = (y: number): number => Math.pow(10, y)

export const calcRedenomination = (
    amount: bigint, 
    decimals: number, 
    round: number
): number => {
    try {
        const divisor = calcExponent(decimals)
        const result = Number(amount * BigInt(calcExponent(round)) / BigInt(divisor)) / calcExponent(round)
        
        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const bDiv = (
    _a: bigint,
    _b: bigint,
    round: number
): number => {
    try {
        const result = Number(((_a * BigInt(calcExponent(round))) / _b)) / calcExponent(round)
      
        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calcIRedenomination = (
    amount: number, 
    decimals: number
): bigint => {
    try {
        const result = BigInt(amount * calcExponent(decimals))
        if (isNaN(Number(result))) throw new Error('Invalid calculation')
        return result
    } catch (error) {
        console.error(error)
        return BigInt(0)
    }
}

export const calInverse = (
    y: number,
    round: number
): number => {
    try {
        if (y === 0) return 0
        const result = Number.parseFloat((1 / y).toFixed(round))

        return result
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const calcRound = (
    y: number | string, 
    round: number
): number => {
    try {
        return Number(Number.parseFloat(y.toString()).toFixed(round))
    } catch (ex) {
        console.error(ex)
        return 0
    }
}

export const mulNumberBigInt = (
    x: bigint,
    y: number, 
    round: number,
): bigint => {
    try {
        return (x * BigInt(y * calcExponent(round))) / BigInt(calcExponent(round))
    } catch (ex) {
        console.error(ex)
        return BigInt(0)
    }
}






