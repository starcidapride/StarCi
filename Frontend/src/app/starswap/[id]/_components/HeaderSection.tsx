import { useContext } from 'react'
import { TokenContext } from '../layout'
import { Button, Skeleton } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { PriceImpact } from '@app/_components'

interface HeaderSectionProps {
  className?: string;
}

export const HeaderSection = (props: HeaderSectionProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const tokenState = useContext(TokenContext)
    return (
        <div>
            <div className={`flex justify-between items-end ${props.className}`}>
                <div>
                    {tokenState.finishLoadWithoutAuth ? (
                        <div className="text-3xl font-black">
                            {tokenState.token0Symbol} / {tokenState.token1Symbol}
                        </div>
                    ) : (
                        <div>
                            <Skeleton className="w-36 h-9 rounded" />
                        </div>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                        { tokenState.finishLoadWithoutAuth ?
                            <div className="text-sm"> 1 {tokenState.token0Symbol} = {tokenState.token0Price} {tokenState.token1Symbol}
                            </div>
                            : <Skeleton className="w-28 h-5 rounded" />
                        }
                    
                        <PriceImpact
                            token0BasePrice={tokenState.token0BasePrice}
                            token0Price={tokenState.token0Price}
                            finishLoad={tokenState.finishLoadWithoutAuth}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push(`${pathname}/add-liquidity`)}
                        className="border-teal-500 text-teal-500 font-bold"
                        variant="bordered"
                    >
                        {' '}
            Add Liquidity{' '}
                    </Button>
                    <Button
                        onClick={() => router.push(`${pathname}/swap`)}
                        className="bg-teal-500 text-white font-bold"
                    >
                        {' '}
            Swap{' '}
                    </Button>
                </div>
            </div>
        </div>
    )
}
