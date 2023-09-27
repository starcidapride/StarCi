import {Image} from '@nextui-org/react'

interface TokenShowProps {
    symbol: string,
    image?: string
}

export const TokenShow = (props : TokenShowProps) => 
    <div className="flex items-center gap-2">
        <Image className="w-5 h-5" src={props.image ?? '/icons/Unknown.svg'} alt="okie"/>
        <div className = "text-sm font-bold">
            {props.symbol}
        </div>
    </div>