interface BalanceShowProps {
    balance: number,
    finishLoad?: boolean
}

export const BalanceShow = (props: BalanceShowProps) =>
    <div className="text-xs items-center flex gap-1">
        Balance: <span> {props.finishLoad
            ? props.balance
            : 0
        } </span>
    </div>
