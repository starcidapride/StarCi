'use client'
import { Card, CardHeader, CardBody, Divider, ButtonGroup, Button, Spinner } from '@nextui-org/react'
import Web3, { Address } from 'web3'
import {
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    registerables
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useEffect, useReducer, useRef, useState } from 'react'
import { ChartTick, convertSyncEvent, createGradient, TEAL_300, TEAL_50, TEAL_500 } from '@utils'
import { ScopeReference } from '@app/_components/Commons'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'
import { getLiquidityPoolContract, getToken0, getToken0Constant, getToken1, getToken1Constant } from '@web3'
import { EventLog } from 'web3-eth-contract'
import { getDecimals, getSymbol, getWebsocketWeb3 } from '@web3'
import { initialTokenState, tokenReducer } from '@app/starswap/_extras'

ChartJS.register(
    ...registerables
)

export const options: ChartOptions = {
    responsive: true,

    elements: {
        line: {
            borderJoinStyle: 'round',
            borderWidth : 1.25
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            bodyColor: TEAL_500,
            displayColors: false,
            bodyFont: { weight: 'bold' },
            callbacks: {
                title: () => {
                    return ''
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                maxRotation: 0,
                callback: function(val, index) {
                    return index % 3 === 0 ? this.getLabelForValue(val as number) : ''
                },  
            },
        },
        y: {
            grid: {
                display: false
            },
            suggestedMin: 100
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

    const [labels, setLabels] = useState<string[]>([])

    const [data, setData] = useState<ChartTick[] | null>(null)
    
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

            const _token0Constant = await getToken0Constant(chainName, _token0)
            if (_token0Constant == null) return
            tokenDispatch({type: 'SET_TOKEN0_CONSTANT', payload: _token0Constant})
                
            const _token1Constant = await getToken1Constant(chainName, _token1)
            if (_token1Constant == null) return
            tokenDispatch({type: 'SET_TOKEN1_CONSTANT', payload: _token1Constant})

            const contract = getLiquidityPoolContract(web3.current, props.poolAddress)

            const syncEvents = await contract.getPastEvents('Sync', {
                fromBlock: 0,
                toBlock: 'latest'
            })  
            
            const chartItems: ChartTick[] = []
            for (const event of syncEvents){
                const _readableEvent = await convertSyncEvent(
                    event as EventLog,
                    chainName,
                    tokenState.token0Decimals,
                    tokenState.token1Decimals,
                    tokenState.token0Constant,
                    tokenState.token1Constant
                )
                chartItems.push(_readableEvent)
            }

            setLabels(chartItems.map(item => item.time.toLocaleString()))
            setData(chartItems)
        }
        handleEffect()
    }, [])

    useEffect(() => {
        const handleEffect = async () => {
            const chart = chartRef.current

            if (!chart) return

            const chartData : ChartData = {
                labels,
                datasets: [
                    {
                        label: tokenState.token0Symbol,
                        data: [],
                        fill: true,
                        pointBorderColor: TEAL_500,
                        pointBackgroundColor: TEAL_500,       
                        borderColor: TEAL_500,
                        backgroundColor: createGradient(
                            chart.ctx,
                            chart.chartArea,
                            TEAL_50,
                            TEAL_300,
                            true,
                        ),
                        pointStyle: 'circle',
                        pointRadius: 1.5,
                        pointHoverRadius: 2
                    }
                ],
            }
         
            setChartData(chartData)

            setFinishLoad(true)

            console.log('proccessed')
        }
        handleEffect()
    }, [labels])

    console.log(finishLoad)

    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Price Chart </CardHeader>
        <Divider />
        <CardBody>
            <div className="flex items-center justify-between px-4">
                C
                <ButtonGroup size="sm" variant="flat" className="border-teal-500 rounded-lg" >
                    <Button className="bg-teal-500 font-bold">24H</Button>
                    <Button className="font-bold"> 1W </Button>
                    <Button className="font-bold" >1M</Button>
                    <Button className="font-bold">1Y</Button>
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
            <div className="flex flex-row-reverse">
                <ScopeReference address={props.poolAddress} className="mt-3 font-bold"/>
            </div>

        </CardBody>
    </Card>)
}