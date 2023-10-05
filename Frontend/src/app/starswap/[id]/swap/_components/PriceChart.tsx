'use client'
import { Card, CardHeader, CardBody, Divider, Select, SelectItem, Tabs, Tab } from '@nextui-org/react'
import Web3, { Address } from 'web3'
import {
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    registerables
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useEffect, useReducer, useRef, useState } from 'react'
import { bDiv, calcRedenomination, calcRound, createGradient, RED_300, RED_50, RED_500, TEAL_300, TEAL_50, TEAL_500 } from '@utils'
import { ScopeReference } from '@app/_components/Commons'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'
import { LPTick, getLiquidityPoolCreationInfo, getTicks, getToken0, getToken0Constant, getToken1, getToken1Constant } from '@web3'
import { getDecimals, getSymbol, getWebsocketWeb3 } from '@web3'
import { initialTokenState, tokenReducer } from '@app/starswap/_context'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { LogsSubscription } from 'web3-eth'

ChartJS.register(
    ...registerables
)




export const PriceChart = (props: PriceChartProps) => {

    const chainName = useSelector((state: RootState) => state.blockchain.chainName)

    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

    const chartRef = useRef<ChartJS>(null)

    const web3 = useRef<Web3>(getWebsocketWeb3(chainName))

    const [ticks, setTicks] = useState<LPTick[]>([])

    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
    })

    const [ratio, setRatio] = useState<number | null>(null)

    const [chartInterval, setChartInterval] = useState<ChartInterval>(ChartInterval._24H)

    const [chartType, setChartType] = useState<ChartType>(ChartType.token0Price)

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(() => {
        let subscription: LogsSubscription

        const handleEffect = async () => {
            try {
                const subscription = await web3.current.eth.subscribe(
                    'logs', {
                        topics: ['0xcf2aa50876cdfbb541206f89af0ee78d44a2abf8d328e37fa4917f982149848a'],
                        address: props.poolAddress
                    })

                subscription.on('data', async () => {
                    const newTicks = await getTicks(chainName, props.poolAddress)
                    if (newTicks) {
                        setTicks(newTicks)
                    }
                })
            } catch (error) {
                console.error('Error occurred while subscribing to logs:', error)
            }
        }

        handleEffect()

        return () => {
            try {
                subscription.unsubscribe()
            } catch (error) {
                console.error('Error occurred while unsubscribing')
            }

        }
    }, [])

    useEffect(() => {
        const handleEffect = async () => {

            const _token0 = await getToken0(chainName, props.poolAddress)
            if (_token0 == null) return
            tokenDispatch({ type: 'SET_TOKEN0', payload: _token0 })

            const _token1 = await getToken1(chainName, props.poolAddress)
            if (_token1 == null) return
            tokenDispatch({ type: 'SET_TOKEN1', payload: _token1 })

            const _token0Symbol = await getSymbol(chainName, _token0)
            if (_token0Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol })

            const _token1Symbol = await getSymbol(chainName, _token1)
            if (_token1Symbol == null) return
            tokenDispatch({ type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol })

            const _token0Decimals = await getDecimals(chainName, _token0)
            if (_token0Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals })

            const _token1Decimals = await getDecimals(chainName, _token1)
            if (_token1Decimals == null) return
            tokenDispatch({ type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals })

            const _token0Constant = await getToken0Constant(chainName, props.poolAddress)
            if (_token0Constant == null) return
            tokenDispatch({ type: 'SET_TOKEN0_CONSTANT', payload: _token0Constant })

            const _token1Constant = await getToken1Constant(chainName, props.poolAddress)
            if (_token1Constant == null) return
            tokenDispatch({ type: 'SET_TOKEN1_CONSTANT', payload: _token1Constant })

            const info = await getLiquidityPoolCreationInfo(chainName, props.poolAddress)
            if (info == null) return

            const ticks = await getTicks(chainName, props.poolAddress)
            if (ticks == null) return

            setTicks(ticks)
        }
        handleEffect()
    }, [])

    useEffect(() => {
        console.log('called')
        const handleEffect = async () => {
            console.log(ticks)

            const chart = chartRef.current

            const backDate = new Date()

            switch (chartInterval) {
            case ChartInterval._24H:
                backDate.setDate(backDate.getDate() - 1)
                break
            case ChartInterval._1W:
                backDate.setDate(backDate.getDate() - 7)
                break
            case ChartInterval._1M:
                backDate.setMonth(backDate.getMonth() - 1)
                break
            case ChartInterval._1Y:
                backDate.setFullYear(backDate.getFullYear() - 1)
                break
            default:
                break
            }

            console.log('A' + chartInterval)

            const _displayTicks = ticks.filter(tick => tick.timestamp >= backDate)

            if (_displayTicks.length == 0) return

            const firstTick = _displayTicks[0]
            const lastTick = _displayTicks.at(-1)
            if (lastTick == undefined) return

            let _ratio: number
            let _dataset: number[]

            switch (chartType) {
            case ChartType.token0:
                _ratio = bDiv(lastTick.token0, firstTick.token0, 3)
                _dataset = _displayTicks.map(tick => calcRedenomination(tick.token0, tokenState.token0Decimals, 3))
                break
            case ChartType.token1:
                _ratio = bDiv(lastTick.token1, firstTick.token1, 3)
                _dataset = _displayTicks.map(tick => calcRedenomination(tick.token1, tokenState.token1Decimals, 3))
                break
            case ChartType.token0Price:
                _ratio = bDiv(lastTick.token0Price, firstTick.token0Price, 3)

                _dataset = _displayTicks.map(tick => {
                    console.log(tick.token0Price)
                    console.log(tokenState.token0Decimals)
                    return calcRedenomination(tick.token0Price, tokenState.token0Decimals, 3)
                }
                )
                break
            }

            console.log(_dataset)

            setRatio(_ratio)

            const trend50Color = _ratio >= 1 ? TEAL_50 : RED_50
            const trend300Color = _ratio >= 1 ? TEAL_300 : RED_300
            const trend500Color = _ratio >= 1 ? TEAL_500 : RED_500

            const labels = ticks.map(tick => tick.timestamp.toLocaleString())

            if (!chart) return

            const chartData: ChartData = {
                labels,
                datasets: [
                    {
                        label: '',
                        data: _dataset,
                        fill: true,
                        pointBorderColor: trend500Color,
                        pointBackgroundColor: trend500Color,
                        borderColor: trend500Color,
                        backgroundColor: createGradient(
                            chart.ctx,
                            chart.chartArea,
                            trend50Color,
                            trend300Color,
                            true,
                        ),
                        pointStyle: 'circle',
                        pointRadius: 3,
                        pointHoverRadius: 4.5
                    }
                ],
            }

            setChartData(chartData)

            setFinishLoad(true)
        }

        handleEffect()

    }, [ticks, chartType, chartInterval])

    console.log(finishLoad)

    const chartIntervals = [
        {
            id: ChartInterval._24H,
            value: '24H'
        },
        {
            id: ChartInterval._1W,
            value: '1W'
        },
        {
            id: ChartInterval._1M,
            value: '1M'
        },
        {
            id: ChartInterval._1Y,
            value: '1Y'
        }
    ]

    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Price Chart </CardHeader>
        <Divider />
        <CardBody>
            <div className="flex items-center justify-between">
                <div>
                    {finishLoad ?
                        <div className="gap-2 flex items-end"> 
                            <span className="text-4xl font-bold">{calcRedenomination(ticks.at(-1)?.token0Price ?? BigInt(0), tokenState.token0Decimals, 3)}</span>
                            <span className="text-sm"> {tokenState.token0Symbol}/{tokenState.token1Symbol}</span>
                        </div>
                        :
                        <div>
                            <div className="h-12" />
                        </div>
                    }
                </div>

                <Tabs size="sm"
                    variant="solid"
                    isDisabled={!finishLoad}
                    selectedKey={chartInterval.toString()}
                    onSelectionChange={key => {
                        const _key = Number(key)
                        setChartInterval(_key)
                    }}
                    classNames={{
                        cursor: 'bg-teal-500 text-white',
                        tabContent: 'font-bold group-data-[selected=true]:text-white',
                    }}
                >
                    {chartIntervals.map(interval =>
                        <Tab key={interval.id} title={interval.value} />
                    )}
                </Tabs>
            </div>
            <div className="mt-6">

                {finishLoad ?
                    <div className={`flex items-center gap-1 text-sm ${(ratio ?? 1) >= 1 ? 'text-teal-500' : 'text-red-500'}`}>
                        {(ratio ?? 1) >= 1 ? <ArrowUpIcon width={12} height={12} /> : <ArrowDownIcon width={12} height={12} />}
                        {calcRound(Math.abs(1 - (ratio ?? 1)) * 100, 3)} %
                    </div>
                    : <div className="h-3.5 w-12 rounded-full" />
                }

                <Chart type="line" className="mt-4" ref={chartRef} options={options} data={chartData} />
            </div>
            <div className="flex justify-between mt-4 items-center">
                <Select
                    aria-label="select"
                    size="sm"
                    isDisabled={!finishLoad}
                    items={
                        finishLoad ?
                            [
                                {
                                    id: ChartType.token0,
                                    value: `${tokenState.token0Symbol} Locked`
                                },
                                {
                                    id: ChartType.token1,
                                    value: `${tokenState.token1Symbol} Locked`
                                },
                                {
                                    id: ChartType.token0Price,
                                    value: `${tokenState.token0Symbol} Price`
                                }
                            ] : []}
                    labelPlacement="outside"
                    className="max-w-[175px]"
                    onChange={
                        event => setChartType(Number.parseInt(event.target.value))
                    }
                    selectedKeys={finishLoad ? [chartType.toString()] : undefined}
                >
                    {(item) => <SelectItem
                        key={item.id} isReadOnly={chartType == item.id}>{item.value}</SelectItem>}
                </Select>

                <ScopeReference address={props.poolAddress} className="font-bold text-sm" />
            </div>

        </CardBody>
    </Card>)
}

export const options: ChartOptions = {
    responsive: true,

    elements: {
        line: {
            borderJoinStyle: 'round',
            borderWidth: 3
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            displayColors: false,
            bodyFont: { weight: 'bold' }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                display: false
            },
        },
        y: {
            grid: {
                display: false
            }
        }
    }
}

export interface PriceChartProps {
    poolAddress: Address
    className?: string,
}

export enum ChartInterval {
    _24H = 0,
    _1W = 1,
    _1M = 2,
    _1Y = 3
}

export enum ChartType {
    token0,
    token1,
    token0Price
}