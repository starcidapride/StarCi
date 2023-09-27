import { ScopeReference } from '@app/_components/Commons'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { TokenShowSkeleton } from '@app/_components/Commons/TokenShowSkeleton'
import { Card, CardHeader, CardBody, Divider, Textarea } from '@nextui-org/react'
import { RootState } from '@redux/store'
import { getSymbol } from '@web3/contracts/erc20'
import { getToken0, getToken1 } from '@web3/contracts/liquidity-pool/liquidity-pool.contract'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'web3'

interface TradeSectionProps {
    poolAddress: Address 
    className? : string
}

export const SwapSection = (props: TradeSectionProps) => {
    
    const chainName = useSelector((state: RootState) => state.chainName.chainName)

    const [token0Symbol, setTokenSymbol0] = useState<string|null>(null)
    const [token1Symbol, setTokenSymbol1] = useState<string|null>(null)
    
    const [finishLoad, setFinishLoad] = useState(false)
    useEffect(
        () => {
            const handleEffect = async () => {
                const _token0 = await getToken0(chainName, props.poolAddress)
                const _token1 = await getToken1(chainName, props.poolAddress)

                const _token0Symbol = await getSymbol(chainName, _token0!)
                const _token1Symbol = await getSymbol(chainName, _token1!)

                setTokenSymbol0(_token0Symbol)
                setTokenSymbol1(_token1Symbol)

                setFinishLoad(true)
            }
            handleEffect()
        }
        ,[]
    )

    return (  <Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Swap </CardHeader>
        <Divider/>
        <CardBody>
            <ScopeReference address={props.poolAddress} className="font-bold" type="contract"/>

            <div className="mt-12">
                <div>
                    { finishLoad ? 
                        <TokenShow image="/icons/stable-coins/USDT.svg" symbol={token1Symbol!}/>
                        : <TokenShowSkeleton />
                    }
                    <Textarea className="max-w-xs" /> 
                </div>

                <div>
                    { finishLoad ? 
                        <TokenShow symbol={token0Symbol!}/>
                        : <TokenShowSkeleton />
                    }
                    <Textarea
                        className="max-w-xs"
                    />
                </div>
            </div>
        </CardBody>
    </Card>)
}