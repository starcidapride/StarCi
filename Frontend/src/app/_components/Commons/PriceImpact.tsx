'use client'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { Skeleton } from '@nextui-org/react'
import { calPercentage } from '@utils'

interface PriceImpactProps {
    className?: string
    finishLoad?: boolean,
    token0Price: number,
    token0BasePrice: number,
}

export const PriceImpact = (props: PriceImpactProps) =>
    ( <div className={`${props.className}`}>
        { props.finishLoad ?        
            (props.token0Price / props.token0BasePrice >= 1 ? (
                <div className="flex items-center gap-1 text-teal-500">
                    <ArrowUpIcon height={14} width={14} />
                    <span className="text-sm">
                        {' '}
                        {calPercentage(
                            props.token0Price,
                            props.token0BasePrice,
                            3,
                        )}{' '}
                    %
                    </span>
                </div>
            ) : (
                <div className="flex gap-1 items-center text-red-500">
                    <ArrowDownIcon height={14} width={14} />
                    <span className="text-sm">
                        {' '}
                        {calPercentage(
                            props.token0Price,
                            props.token0BasePrice,
                            3,
                        )}{' '}
                    %
                    </span>
                </div>
            ))                     
            : <Skeleton className="h-5 w-12 rounded"/>}
    </div>)


