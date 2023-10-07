import { ChainName, GAS_LIMIT, GAS_PRICE } from '@utils'
import Web3, { Address, Contract, Transaction, TransactionReceipt } from 'web3'
import abi from './liquidity-pool.abi'
import { getFactoryContract, getHttpWeb3 } from '@web3'
import { EventLog } from 'web3-eth-contract'

export const getLiquidityPoolContract = (
    web3: Web3,
    poolAddress: Address
): Contract<typeof abi> => new web3.eth.Contract(abi, poolAddress, web3)

export const getToken0 = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<Address | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0().call()
    } catch (ex) {
        console.log(ex)
        return null
    }

}

export const getToken1 = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<Address | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LiquidityPoolProps = {
    liquidityPool: Address,
    token0: Address,
    token1: Address,
    token0Holding: string,
    token1Holding: string
}
export const getProps = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<LiquidityPoolProps | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const _queried = await liquidityPoolContract.methods.getProps().call()
        return {
            liquidityPool: contractAddress,
            token0: _queried.token0,
            token1: _queried.token1,
            token0Holding: _queried.token0Holding.toString(),
            token1Holding: _queried.token1Holding.toString()
        }
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0Output = async (
    chainName: ChainName,
    contractAddress: Address,
    _token1Input: bigint,
    abortController?: AbortController,
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0Output(_token1Input).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken1Output = async (
    chainName: ChainName,
    contractAddress: Address,
    _token0Input: bigint,
    abortController?: AbortController,
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName, abortController)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1Output(_token0Input).call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0BasePrice = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0BasePrice().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0MaxPrice = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0MaxPrice().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const swap = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amountTokenIn: bigint,
    _minAmountTokenOut: bigint,
    _isBuy: boolean
): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.swap(
            _amountTokenIn,
            _minAmountTokenOut,
            _isBuy
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getToken0Constant = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token0Constant().call()
    } catch (ex) {
        console.log(ex)
        return null
    }

}

export const getToken1Constant = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<bigint | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.token1Constant().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

type LiquidityPoolCreationInfo = {
    blockNumber: number,
    timestamp: Date
}


export const getLiquidityPoolCreationInfo = async (
    chainName: ChainName,
    contractAddress: Address,
): Promise<LiquidityPoolCreationInfo | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const factoryContract = getFactoryContract(chainName)
        const createdEvents = await factoryContract.getPastEvents('CreateLiquidityPool',
            {
                fromBlock: 0,
                toBlock: 'latest'
            }
        )
        const event = createdEvents.find(_event =>
            (_event as EventLog).returnValues[1] == contractAddress)

        const blockNumber = Number((event as EventLog).blockNumber as bigint)
        const block = await web3.eth.getBlock(blockNumber)
        const timestamp = new Date(Number(block.timestamp) * 1000)
        return {
            blockNumber,
            timestamp
        }
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPTick = {
    amountToken0Locked: bigint
    amountToken1Locked: bigint
    previousToken0Price: bigint
    token0Price: bigint
    amountSwappedToken0: bigint 
    amountSwappedToken1: bigint
    isBuy: boolean
    timestamp: Date
}

export const getTicks = async (
    chainName: ChainName,
    contractAddress: Address
): Promise<LPTick[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const ticks = await liquidityPoolContract.methods.getTicks().call()
        const _result: LPTick[] = []
        for (const tick of ticks) {
            const _isBuy = tick.amount0In == 0 && tick.amount1Out == 0
            _result.push({
                amountToken0Locked: BigInt(tick.amountToken0Locked),
                amountToken1Locked: BigInt(tick.amountToken1Locked),
                previousToken0Price: BigInt(tick.previousToken0Price),
                token0Price: BigInt(tick.token0Price),
                amountSwappedToken0: _isBuy ? BigInt(tick.amount0Out) : BigInt(tick.amount0In),
                amountSwappedToken1: _isBuy ? BigInt(tick.amount1In) : BigInt(tick.amount1In),
                isBuy: _isBuy,
                timestamp: new Date(Number(tick.timestamp) * 1000)
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const startEarning = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address
): Promise<TransactionReceipt | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.startEarning().encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const getHasEarned = async (
    web3: Web3,
    contractAddress: Address
): Promise<boolean | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        return await liquidityPoolContract.methods.hasEarned().call()
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const depositTokens = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amountToken1In: bigint,
    _amountProfitableTokenOut: bigint

): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.depositTokens(
            _amountToken1In,
            _amountProfitableTokenOut
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const withdrawTokens = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amountProfitableTokenIn: bigint,
): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.withdrawTokens(
            _amountProfitableTokenIn
        ).encodeABI()

        return await web3.eth.sendTransaction({
            from: fromAddress,
            to: contractAddress,
            data,
            gasLimit: GAS_LIMIT,
            gasPrice: GAS_PRICE
        })
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPRewardTick = {
    amountProfitableToken : bigint,
    timestamp: Date
} 

export const getRewards = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPRewardTick[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const rewards = await liquidityPoolContract.methods.getRewards(
            _address
        ).call()
        const _result: LPRewardTick[] = []
        for (const reward of rewards) {

            _result.push({
                amountProfitableToken: BigInt(reward.amountProfitableToken),
                timestamp: new Date(Number(reward.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPDepositTick = {
    amountToken1In : bigint,
    amountProfitableTokenOut: bigint,
    timestamp: Date
} 

export const getDeposits = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPDepositTick[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const deposits = await liquidityPoolContract.methods.getDeposits(
            _address
        ).call()
        const _result: LPDepositTick[] = []
        for (const deposit of deposits) {

            _result.push({
                amountToken1In: BigInt(deposit.amountProfitableTokenOut),
                amountProfitableTokenOut: BigInt(deposit.amountProfitableTokenOut),
                timestamp: new Date(Number(deposit.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPWithdrawTick = {
    amountProfitableTokenIn : bigint,
    amountToken1Out: bigint,
    timestamp: Date
} 

export const getWithdrawals = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPWithdrawTick[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const deposits = await liquidityPoolContract.methods.getWithdrawals(
            _address
        ).call()
        const _result: LPWithdrawTick[] = []
        for (const deposit of deposits) {

            _result.push({
                amountProfitableTokenIn: BigInt(deposit.amountProfitableTokenIn),
                amountToken1Out: BigInt(deposit.amountProfitableTokenIn),
                timestamp: new Date(Number(deposit.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}