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
import { faker } from '@faker-js/faker'
import { useEffect, useRef, useState } from 'react'
import { createGradient, teal300, teal50, teal500 } from '@utils'
import { ScopeReference } from '@app/_components/Commons'
import { getWebsocketWeb3 } from '@web3/web3.utils'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/store'

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
            }
        },
        y: {
            grid: {
                display: false
            }
        },
        xAxis: {
            ticks: {
                maxTicksLimit: 10
            }
        }

    }   
}

interface PriceChartProps {
    poolAddress: Address
    className?: string,
}

export const deriveTimeFromKey = (key: number) => {
    if (key < 0 || key > 47) return
    const hour = Math.floor(key / 2)
    const minute = key % 2 === 0 ? '00' : '30'
    return `${hour}:${minute}`
}

export const deriveTimeFromKeyEach3Hours = (key: number) : string[] | null => {
    if (key < 0 || key > 47) return null

    const timeList: string[] = []

    for (let i = 0; i < 48; i++){
        let value : string 
        if (i % 6 == 0){
            const valueI = key - i / 6
            const unsignedI = valueI < 0 ? valueI + 48 : valueI
            value = deriveTimeFromKey(unsignedI)!
        } else {
            value = ''
        }
        timeList.push(value)
    }
    timeList.reverse()
    return timeList
}

export const PriceChart = (props: PriceChartProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const chartRef = useRef<ChartJS>(null)

    const [labels, setLabels] = useState<string[]>([])

    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
    })
    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(() => {
        const handleEffect = async () => {

            const web3 = getWebsocketWeb3(chainName)
            
            const currentDate = new Date()
            const currentHour = currentDate.getHours()
            const currentMinute = currentDate.getMinutes()
            
            const key = currentHour * 2 + (currentMinute >= 30 ? 1 : 0)

            setLabels(deriveTimeFromKeyEach3Hours(key)!)
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
                        label: '',
                        data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
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