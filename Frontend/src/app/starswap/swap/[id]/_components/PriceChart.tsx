'use client'
import { Card, CardHeader, CardBody, Divider, ButtonGroup, Button, Spinner, Skeleton } from '@nextui-org/react'
import Web3, { Address } from 'web3'
import {
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    registerables
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useEffect, useReducer, useRef, useState } from 'react'
import { calcRound, ChartTick, convertSyncEvent, createGradient, RED_300, RED_50, RED_500, TEAL_300, TEAL_50, TEAL_500 } from '@utils'
import { ScopeReference } from '@app/_components/Commons'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'
import { getHttpWeb3, getLiquidityPoolContract, getLiquidityPoolCreationInfo, getToken0, getToken0Constant, getToken1, getToken1Constant } from '@web3'
import { EventLog } from 'web3-eth-contract'
import { getDecimals, getSymbol, getWebsocketWeb3 } from '@web3'
import { initialTokenState, tokenReducer } from '@app/starswap/_extras'
import { ArrowDownIcon, ArrowUpIcon, ClockIcon } from '@heroicons/react/24/outline'

ChartJS.register(
    ...registerables
)

export const options: ChartOptions = {
    responsive: true,

    elements: {
        line: {
            borderJoinStyle: 'round',
            borderWidth : 3
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            displayColors: false,
            bodyFont: { weight: 'bold' },
            callbacks: {
                title: () => ''
            }
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

interface PriceChartProps {
    poolAddress: Address
    className?: string,
}


export const PriceChart = (props: PriceChartProps) => {
    
    const chainName = useSelector((state: RootState) => state.chainName.chainName)

    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)
    
    const chartRef = useRef<ChartJS>(null)

    const web3 = useRef<Web3>(getWebsocketWeb3(chainName))

    const [from, setFrom] = useState<Date>()

    const [labels, setLabels] = useState<number[]>([])
    const [ticks, setTicks] = useState<ChartTick[]>([])
    
    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
    })

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(() => {
        const handleEffect = async () => {
            
            const _token0 = await getToken0(chainName, props.poolAddress)
            if (_token0 == null) return
            tokenDispatch({type: 'SET_TOKEN0', payload: _token0})

            const _token1 = await getToken1(chainName, props.poolAddress)
            if (_token1 == null) return
            tokenDispatch({type: 'SET_TOKEN1', payload: _token1})

            const _token0Symbol = await getSymbol(chainName, _token0)
            if (_token0Symbol == null) return
            tokenDispatch({type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol})
    
            const _token1Symbol = await getSymbol(chainName, _token1)
            if (_token1Symbol == null) return
            tokenDispatch({type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol})
    
            const _token0Decimals = await getDecimals(chainName, _token0)
            if (_token0Decimals == null) return
            tokenDispatch({type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals})
                
            const _token1Decimals = await getDecimals(chainName, _token1)
            if (_token1Decimals == null) return
            tokenDispatch({type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals})

            const _token0Constant = await getToken0Constant(chainName, props.poolAddress)
            if (_token0Constant == null) return
            tokenDispatch({type: 'SET_TOKEN0_CONSTANT', payload: _token0Constant})
                
            const _token1Constant = await getToken1Constant(chainName, props.poolAddress)
            if (_token1Constant == null) return
            tokenDispatch({type: 'SET_TOKEN1_CONSTANT', payload: _token1Constant})

            const info = await getLiquidityPoolCreationInfo(chainName, props.poolAddress)
            if (info == null) return

            setFrom(info.timestamp)

            const contract = getLiquidityPoolContract(getHttpWeb3(chainName), props.poolAddress)
            const syncEvents = await contract.getPastEvents('Sync', {
                fromBlock: info.blockNumber,
                toBlock: 'latest',
            })  
            
            const ticks: ChartTick[] = []
            for (const event of syncEvents){
                const _readableEvent = convertSyncEvent(
                    event as EventLog,
                    tokenState.token0Decimals,
                    tokenState.token1Decimals,
                    tokenState.token0Constant,
                    tokenState.token1Constant
                )
                ticks.push(_readableEvent)
            }

            setLabels(ticks.map((_, index) => index))
            setTicks(ticks)
        }
        handleEffect()
    }, [])

    const [ratio, setRatio] = useState(0)

    useEffect(() => {
        const handleEffect = async () => {
            const chart = chartRef.current

            const lastTick = ticks.at(-1)
            if (lastTick == undefined) return
            
            const _ratio = lastTick.token0Price / ticks[0].token0Price
            setRatio(_ratio)

            const _trendUp = _ratio >= 1  
     
            if (!chart) return

            const trend50Color = _trendUp ? TEAL_50 : RED_50
            const trend300Color = _trendUp ? TEAL_300 : RED_300
            const trend500Color = _trendUp ? TEAL_500 : RED_500

            const chartData : ChartData = {
                labels,
                datasets: [
                    {
                        label: '',
                        data: labels.map((index) => ticks[index].token0Price),
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
    }, [labels])

    console.log(finishLoad)

    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Price Chart </CardHeader>
        <Divider />
        <CardBody>
            <div className="flex items-start justify-between">
                <div>
                    <div className="font-bold text-xl"> 1  {tokenState.token0Symbol} = {ticks.at(-1)?.token0Price} {tokenState.token1Symbol}  </div>
                    { ratio ?
                        <div className={`flex items-center gap-1 text-sm ${ratio > 1 ? 'text-teal-500' : 'text-red-500'}`}>
                            {ratio > 1 ? <ArrowUpIcon width={16} height={16} /> : <ArrowDownIcon width={16} height={16}/>}
                            {calcRound(Math.abs(1 - ratio) * 100, 3)} %
                        </div>
                        : <Skeleton className="w-16 h-4 rounded-full"/>
                    }
                </div>
                
                
                <ButtonGroup size="sm" variant="flat" className="border-teal-500 rounded-lg" >
                    <Button className="font-bold">24H</Button>
                    <Button className="font-bold"> 1W </Button>
                    <Button className="font-bold"> 1M </Button>
                    <Button className="bg-teal-500 font-bold"> All </Button>
                </ButtonGroup>
            </div>
            <Chart className={`mt-6 ${!finishLoad ? '!hidden' : ''}`} type='line' ref={chartRef} options={options} data={chartData} />
            {   
                !finishLoad
                    ? <div className="h-80 place-content-center flex">
                        <Spinner color="default" />
                    </div>
                    : null
            }
            <div className="flex justify-between mt-3 items-center">
                { from ?
                    <div className="items-center flex gap-1">
                        <ClockIcon width={16} height={16} /> <div className="text-sm"> {from.toLocaleString()} </div>
                    </div>
                    : <Skeleton className="w-24 h-4 rounded-full" /> 
                }
                <ScopeReference address={props.poolAddress} className="font-bold text-sm"/>
            </div>

        </CardBody>
    </Card>)
}