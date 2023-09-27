import { Card, CardHeader, Image, CardBody, Divider, ButtonGroup, Button } from '@nextui-org/react'
import { Address } from 'web3'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
    Filler
} from 'chart.js'

import { Chart } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
import { useEffect, useRef, useState } from 'react'
import { createGradient, teal300, teal50, teal500 } from '@utils/color.utils'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)


export const options: ChartOptions = {
    responsive: true,
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
        },
    }
}

interface PriceChartProps {
    poolAddress: Address
    className?: string,
}

export const PriceChart = (props: PriceChartProps) => {
    const chartRef = useRef<ChartJS>(null)

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
        datasets: [],
    })

    useEffect(() => {
        const chart = chartRef.current

        if (!chart) return

        const chartData = {
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
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ],
        }

        setChartData(chartData)
    }
    , [])


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
            <Chart className="mt-6" type='line' ref={chartRef} options={options} data={chartData} />
        </CardBody>
    </Card>)
}