'use client'
import { Image, Skeleton } from '@nextui-org/react'

interface TokenShowProps {
    symbol: string,
    finishLoad? : boolean
    image?: string
}

export const TokenShow = (props : TokenShowProps) => 
    <div className="flex items-center gap-2">
        <Skeleton isLoaded = {props.finishLoad} className="rounded-full">
            <Image className="w-5 h-5" src={props.image ?? '/icons/Unknown.svg'} alt="okie"/>
        </Skeleton>
        { props.finishLoad ?
            <div className="text-sm font-bold">
                {props.symbol}
            </div> : <Skeleton className="rounded-full h-3.5 w-12" />
        } 
    </div>