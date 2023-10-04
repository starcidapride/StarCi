'use client'
import { LiquidityPoolStatistics, LiquidityPoolStatisticsChart, PriceChart, SwapSection } from './_components'

interface PagePrams {
    params: { id: string }
}
const Page = ({ params }: PagePrams) => {
    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
                <div className="col-span-2"> 
                    <PriceChart 
                        poolAddress={params.id} />
                    <div className="mt-6 grid grid-cols-3 gap-6"> 
                        <LiquidityPoolStatistics 
                            poolAddress={params.id} 
                            className="col-span-1" />
                        <LiquidityPoolStatisticsChart 
                            poolAddress={params.id} 
                            className="col-span-2" />
                    </div>

                </div>
            </div>
    
            <div className="col-span-1">
                <SwapSection 
                    poolAddress={params.id}
                    className="col-span-1"/>
            </div>
             
        </div>
    )
}
export default Page
