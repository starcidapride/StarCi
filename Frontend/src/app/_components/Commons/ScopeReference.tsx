import { CreditCardIcon, CurrencyPoundIcon, DocumentTextIcon, UserIcon } from '@heroicons/react/24/outline'
import { Link } from '@nextui-org/react'
import { RootState } from '@redux/store'
import { chainInfos } from '@utils/constant.utils'
import { useSelector } from 'react-redux'

interface ScopeReferenceProps{
    address: string
    isTransaction? : boolean,
    className?: string,
    type?: 'contract'|'address'|'token'
}

export const ScopeReference = (props : ScopeReferenceProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const explorer = chainInfos[chainName].explorer

    const _icon = {
        'contract' : <DocumentTextIcon height={16} width={16} />,
        'address': <UserIcon height={16} width={16} />,
        'token': <CurrencyPoundIcon height={16} width={16} />
    }

    const icon = props.isTransaction ? <CreditCardIcon height={16} width={16}/>
        : _icon[props.type ?? 'address']

    return (
        <div className="flex items-center gap-2">
            {icon}
            <Link isBlock href={`${explorer}${props.isTransaction? 'tx' : 'address'}/${props.address}`} color="foreground" className={`w-fit ${props.className}`}>
                {`${props.address.slice(0,4)}...${props.address.slice(-2)}`}
            </Link>
        </div>
    )
}