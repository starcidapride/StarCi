'use client'
import { useEffect, useState } from 'react'
import { PoolInfo, PriceChart, StatisticLeft, StatisticRight } from './_components'
import { Button } from '@nextui-org/react'
import { HeaderSection } from './_components'

const Page = () => {
    const [test, setTest] = useState(false)
    return (
        <div>
            <HeaderSection/>
            <div className="mt-4 min-h-[600px] mt-12"> 
                <div className="gap-6 grid grid-cols-4 mt-4 ">
                    <StatisticLeft className = "col-span-1"/>
                    <StatisticRight className = "col-span-3"/>
                </div>
            </div>
        </div>
    )
}

export default Page
