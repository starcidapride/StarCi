'use client'
import { PriceChart, SwapSection } from './_components'

interface PagePrams {
  params: { id: string };
}
const Page = ({ params }: PagePrams) => {
    return (
        <div className="grid grid-cols-3 gap-12 items-center">
            <PriceChart className="col-span-2 self-stretch"/>
            <SwapSection className="col-span-1"/>
        </div>
    )
}
export default Page
