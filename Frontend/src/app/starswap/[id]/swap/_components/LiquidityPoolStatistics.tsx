import { ArrowSmallDownIcon } from '@heroicons/react/24/outline'
import { Card, Divider, CardHeader, CardBody } from '@nextui-org/react'
import { Address } from 'web3'

interface LiquidityPoolDetails {
    poolAddress: Address
    className?: string
}
export const LiquidityPoolStatistics = (props: LiquidityPoolDetails) => {
    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Statistics </CardHeader>
        <Divider />
        <CardBody>
            <div>
                <div className = "font-bold text-teal-500 text-sm"> Liquidity </div>
                <div className = "text-xl"> 10000K </div>
                <div className = "text-xs text-teal-500 flex items-center"> <ArrowSmallDownIcon height={12} width={12}/> 100 % </div>
            </div>

            <div className="mt-3">
                <div className = "font-bold text-teal-500 text-sm"> Volume </div>
                <div className = "text-xl"> 999K </div>
                <div className = "text-xs text-teal-500 flex items-center"> <ArrowSmallDownIcon height={12} width={12}/> 100 % </div>
            </div>

        </CardBody>
    </Card>)
}
