import { Card, CardHeader, Image, CardBody, Divider } from '@nextui-org/react'
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

import { Line } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
  
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
  
export const options : ChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        tooltip: {
            bodyColor: 'red'
        }
    }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

export const data : ChartData<'line', number[], string> = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'pink'
        }
    ],
}

interface PriceChartProps {
    poolAddress: Address 
    className? : string,
}

export const PriceChart = (props: PriceChartProps) => {
    return ( <Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Price Chart </CardHeader>
        <Divider/>
        <CardBody>
            <Line options={options} data={data} />
        </CardBody>
    </Card>)
}