'use client'
import { Avatar } from '@nextui-org/react'

export enum ChainName {
    Klaytn,
    Polygon
}
interface ChainInfoProps {
    chainName: ChainName,
    isTestnet?: boolean
}
export const ChainInfo = (props: ChainInfoProps) => {

    const chainDict = {
        [ChainName.Klaytn]: '/icons/Klaytn.svg',
        [ChainName.Polygon]: '/icons/Polygon.svg'
    }

    return (
        <div className="flex gap-2 items-center text-sm">
            <Avatar isBordered className='w-8 h-8' src={chainDict[props.chainName]} />
            {props.isTestnet ? 'Testnet' : 'Mainnet'}
        </div>
    )
}