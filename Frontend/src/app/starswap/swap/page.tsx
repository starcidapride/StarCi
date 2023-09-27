'use client'
import { SwapSection, StatisticChart } from './_components'

const Page = () => {
    return (
        <div className="grid grid-cols-3 span-4">
            <StatisticChart className="col-span-2"/>
            <SwapSection className="col-span-2"/>
        </div>
    )
}
export default Page
