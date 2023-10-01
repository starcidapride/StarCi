'use client'
import { Card, CardHeader, CardBody, Divider, ButtonGroup, Button, Spinner } from '@nextui-org/react'
import { Address } from 'web3'
import {
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    registerables
} from 'chart.js'

import { Chart } from 'react-chartjs-2'
import { useEffect, useRef, useState } from 'react'
import { ChartItemData, calcRedenomination, convertSyncEvent, createGradient, teal300, teal50, teal500 } from '@utils'
import { ScopeReference } from '@app/_components/Commons'
import { getWebsocketWeb3 } from '@web3/web3.utils'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'
import { getLiquidityPoolContract, getToken0, getToken0Constant, getToken1, getToken1Constant } from '@web3/contracts/liquidity-pool/liquidity-pool.contract'
import { EventLog } from 'web3-eth-contract'
import { getDecimals, getSymbol } from '@web3/contracts/erc20'

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
            bodyColor: teal500,
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
    const chartRef = useRef<ChartJS>(null)

    const [labels, setLabels] = useState<string[]>([])

    const [data, setData] = useState<ChartItemData[] | null>(null)
    
    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
    })

    const [finishLoad, setFinishLoad] = useState(false)

    const [token0, setToken0] = useState<string | null>(null)
    const [token1, setToken1] = useState<string | null>(null)

    const [token0Symbol, setToken0Symbol] = useState<string | null>(null)
    const [token1Symbol, setToken1Symbol] = useState<string | null>(null)

    const [token0Decimals, setToken0Decimals] = useState<number | null>(null)
    const [token1Decimals, setToken1Decimals] = useState<number | null>(null)

    
    const [token0Constant, setToken0Constant] = useState<number | null>(null)
    const [token1Constant, setToken1Constant] = useState<number | null>(null)

    useEffect(() => {
        const handleEffect = async () => {
            const _token0 = await getToken0(chainName, props.poolAddress)
            const _token1 = await getToken1(chainName, props.poolAddress)
        
            setToken0(_token0)
            setToken1(_token1)

            const _token0Symbol = await getSymbol(chainName, _token0!)
            const _token1Symbol = await getSymbol(chainName, _token1!)

            setToken0Symbol(_token0Symbol)
            setToken1Symbol(_token1Symbol)

            const _token0Decimals = await getDecimals(chainName, _token0!)
            const _token1Decimals = await getDecimals(chainName, _token1!)

            console.log(_token0Decimals)
            setToken0Decimals(Number.parseInt(_token0Decimals.toString()))
            setToken1Decimals(Number.parseInt(_token1Decimals.toString()))

            const _token0Constant = await getToken0Constant(chainName, props.poolAddress)
            const _token1Constant = await getToken1Constant(chainName,  props.poolAddress)
            
            setToken0Constant(Number.parseInt(_token0Constant!.toString()))
            setToken1Constant(Number.parseInt(_token1Constant!.toString()))


            const web3 = getWebsocketWeb3(chainName)
            
            const contract = getLiquidityPoolContract(web3, props.poolAddress)

            const syncEvents = await contract.getPastEvents('Sync', {
                fromBlock: 0,
                toBlock: 'latest'
            })  
            
            const chartItems: ChartItemData[] = []
            for (const event of syncEvents){
                const _readableEvent = await convertSyncEvent(
                    event as EventLog,
                    chainName,
                    token0Decimals!,
                    token1Decimals!,
                    token0Constant!,
                    token1Constant!
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
                        label: token0Symbol!,
                        data: labels.map((label) => calcRedenomination(
                            data!.find(_data => _data.time.toLocaleString() == label)!
                                .token0Price, token0Decimals!, 5
                        )),
                        fill: true,
                        pointBorderColor: teal500,
                        pointBackgroundColor: teal500,       
                        borderColor: teal500,
                        backgroundColor: createGradient(chart.ctx,
                            chart.chartArea,
                            teal50,
                            teal300,
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
                    : <div></div>
            }
            <div className="flex flex-row-reverse">
                <ScopeReference address={props.poolAddress} className="mt-3 font-bold"/>
            </div>

        </CardBody>
    </Card>)
}