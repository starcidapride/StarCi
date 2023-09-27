import { Card, Divider, CardHeader, CardBody } from '@nextui-org/react'
import { Address } from 'web3'

interface LiquidityPoolDetails {
    poolAddress: Address 
    className? : string
}
export const LiquidityPoolStatistics = (props: LiquidityPoolDetails) => {
    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Statistics </CardHeader>
        <Divider />
        <CardBody>
            ewe
        </CardBody>
    </Card>)
}
