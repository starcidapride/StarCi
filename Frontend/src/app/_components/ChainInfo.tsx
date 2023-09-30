'use client'
import { Avatar } from '@nextui-org/react'
import { ChainName } from '@utils'


interface ChainInfoProps {
    chainName: ChainName
}
export const ChainInfo = (props: ChainInfoProps) => {

    const chainDict = {
        [ChainName.KlaytnMainnet]: {
            image: '/icons/Klaytn.svg',
            isMainnet: true
        },
        [ChainName.KalytnTestnet]: {
            image: '/icons/Klaytn.svg',
            isMainnet: false
        },
        [ChainName.PolygonMainnet]: {
            image: '/icons/Polygon.svg',
            isMainnet: true
        },
        [ChainName.PolygonTestnet]: {
            image: '/icons/Polygon.svg',
            isMainnet: false
        }
    }

    return (
        <div className="flex gap-3 items-center text-sm">
            <Avatar isBordered className='w-8 h-8' src={chainDict[props.chainName].image} />
            {chainDict[props.chainName].isMainnet ? 'Mainnet' : 'Testnet'}
        </div>
    )
}