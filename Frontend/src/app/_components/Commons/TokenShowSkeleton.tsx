import { Skeleton } from '@nextui-org/react'

export const TokenShowSkeleton = () => {
    return (<div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded-full"/>
        <Skeleton className="h-3.5 w-12 rounded-lg"/>
    </div>)
}