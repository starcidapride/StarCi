import { Link } from '@nextui-org/react'
import { RootState } from '@redux/store'
import { chainInfos } from '@utils'
import { useSelector } from 'react-redux'

interface ScopeReferenceProps{
    address: string
    isTransaction? : boolean,
    className?: string,
    isBlock?: boolean
}

export const ScopeReference = (props : ScopeReferenceProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const explorer = chainInfos[chainName].explorer

    return (
        <Link isBlock={props.isBlock} showAnchorIcon href={`${explorer}${props.isTransaction? 'tx' : 'address'}/${props.address}`} color="foreground" className={`w-fit ${props.className}`}>
            {`${props.address.slice(0,4)}...${props.address.slice(-2)}`}
        </Link>
    )
}