import { ChainName, GAS_LIMIT, GAS_PRICE } from '@utils'
import Web3, { Address, Contract, Transaction } from 'web3'
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
    token0: bigint
    token1: bigint
    token0Price: bigint
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

            _result.push({
                token0: BigInt(tick.token0),
                token1: BigInt(tick.token1),
                token0Price: BigInt(tick.token0Price),
                timestamp: new Date(Number(tick.timestamp) * 1000)
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export const join = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address
): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.join().encodeABI()

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

export const deposit = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amount1TokenIn: bigint
): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.deposit(
            _amount1TokenIn
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

export const withdraw = async (
    web3: Web3,
    fromAddress: Address,
    contractAddress: Address,
    _amountLPTokenIn: bigint,
    _minAmountToken0Out: bigint
): Promise<Transaction | null> => {
    try {
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)

        const data = liquidityPoolContract.methods.withdraw(
            _amountLPTokenIn,
            _minAmountToken0Out
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

export type LPReward = {
    amount : bigint,
    timestamp: Date
} 

export const getRewards = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPReward[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const rewards = await liquidityPoolContract.methods.getRewards(
            _address
        ).call()
        const _result: LPReward[] = []
        for (const reward of rewards) {

            _result.push({
                amount: BigInt(reward.amount),
                timestamp: new Date(Number(reward.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPDeposit = {
    amount : bigint,
    timestamp: Date
} 

export const getDeposits = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPDeposit[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const deposits = await liquidityPoolContract.methods.getDeposits(
            _address
        ).call()
        const _result: LPDeposit[] = []
        for (const deposit of deposits) {

            _result.push({
                amount: BigInt(deposit.amount),
                timestamp: new Date(Number(deposit.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}

export type LPWithdrawal = {
    amount : bigint,
    timestamp: Date
} 

export const getWithdrawals = async (
    chainName: ChainName,
    contractAddress: Address,
    _address: Address
): Promise<LPWithdrawal[] | null> => {
    try {
        const web3 = getHttpWeb3(chainName)
        const liquidityPoolContract = getLiquidityPoolContract(web3, contractAddress)
        const deposits = await liquidityPoolContract.methods.getWithdrawals(
            _address
        ).call()
        const _result: LPWithdrawal[] = []
        for (const deposit of deposits) {

            _result.push({
                amount: BigInt(deposit.amount),
                timestamp: new Date(Number(deposit.timestamp) * 1000),
            })
        }
        return _result
    } catch (ex) {
        console.log(ex)
        return null
    }
}