'use client'
import { Link } from '@nextui-org/react'
import { RootState } from '@redux'
import { chainInfos } from '@utils'
import { useSelector } from 'react-redux'

interface ScopeReferenceProps{
    hash: string
    isTransaction? : boolean,
    className?: string,
    isBlock?: boolean
}

export const ScopeReference = (props : ScopeReferenceProps) => {
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
    const explorer = chainInfos[chainName].explorer

    return (
        <Link isBlock={props.isBlock} target='_blank' showAnchorIcon href={`${explorer}${props.isTransaction? 'tx' : 'address'}/${props.hash}`} color="foreground" className={`w-fit font-bold ${props.className}`}>
            {`${props.hash.slice(0,4)}...${props.hash.slice(-2)}`}
        </Link>
    )
}