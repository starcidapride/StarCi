import { Skeleton } from '@nextui-org/react'

interface BalanceShowProps {
    balance: number,
    finishLoad? : boolean
}

export const BalanceShow = (props : BalanceShowProps) => 
    <div className="text-xs items-center flex gap-1">
    Balance: { props.finishLoad 
            ? <span>{props.balance} </span> 
            : <Skeleton className="rounded-full h-3.5 w-4" />
        }
    </div>
