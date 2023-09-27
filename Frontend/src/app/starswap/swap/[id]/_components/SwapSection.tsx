import { ScopeReference } from '@app/_components/Commons'
import { BalanceShow } from '@app/_components/Commons/BalanceShow'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Divider, Textarea, Button } from '@nextui-org/react'
import { AppDispatch, RootState } from '@redux/store'
import { calcBalance } from '@utils/calc.utils'
import { getBalance, getDecimals, getSymbol } from '@web3/contracts/erc20'
import { getToken0, getToken1 } from '@web3/contracts/liquidity-pool/liquidity-pool.contract'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'web3'
import { SlippageTolerance } from './SlippageTolerance'

interface TradeSectionProps {
    poolAddress: Address 
    className? : string
}

export const SwapSection = (props: TradeSectionProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)
    const dispatch : AppDispatch = useDispatch()
    


    const [token0Symbol, setToken0Symbol] = useState<string|null>(null)
    const [token1Symbol, setToken1Symbol] = useState<string|null>(null)

    const [token0Balance, setToken0Balance] = useState<number>(0)
    const [token1Balance, setToken1Balance] = useState<number>(0)

    const [token0Decimals, setToken0Decimals] = useState<number|null>(null)
    const [token1Decimals, setToken1Decimals] = useState<number|null>(null)

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(
        () => {
            const handleEffect = async () => {
                const _token0 = await getToken0(chainName, props.poolAddress)
                const _token1 = await getToken1(chainName, props.poolAddress)

                const _token0Symbol = await getSymbol(chainName, _token0!)
                const _token1Symbol = await getSymbol(chainName, _token1!)

                setToken0Symbol(_token0Symbol)
                setToken1Symbol(_token1Symbol)
                
                const _token0Decimals = await getDecimals(chainName, _token0!)
                const _token1Decimals = await getDecimals(chainName, _token1!)
                
                setToken0Decimals(Number.parseInt(_token0Decimals.toString()))
                setToken1Decimals(Number.parseInt(_token1Decimals.toString()))
                
                if (web3 && account) {
                    const _token0Balance = await getBalance(chainName, _token0!, account)
                    const _token1Balance = await getBalance(chainName, _token1!, account)
                    
                    setToken0Balance(calcBalance(_token0Balance, _token0Decimals, 5))
                    setToken1Balance(calcBalance(_token1Balance, _token1Decimals, 5))
                }
                
                setToken0Symbol(_token0Symbol)
                setToken1Symbol(_token1Symbol)


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

            <div className="mt-12 space-y-4">
                <div>
                    <div className="flex justify-between">
                        <TokenShow finishLoad={finishLoad} image="/icons/stable-coins/USDT.svg" symbol={token1Symbol!}/>    
                        <BalanceShow balance={token1Balance} finishLoad={finishLoad}/>
                    </div>
                    <Textarea 
                        className="max-w-xs" 
                        maxRows={2}/> 
                </div>
                <div className="flex justify-center">
                    <Button variant="light" isIconOnly radius="full" startContent={<ArrowsUpDownIcon height={24} width={24} />} />    
                </div>
                
                <div>
                    <div className="flex justify-between">
                        <TokenShow finishLoad={finishLoad} symbol={token0Symbol!}/>
                        <BalanceShow balance={token0Balance} finishLoad={finishLoad}/>
                    </div>
                    
                    <Textarea
                        className="max-w-xs"
                        maxRows={2}
                    />
                </div>
            </div>
            <SlippageTolerance className="mt-6"/>
            <Button 
                size="lg" type="submit" className="mt-12 w-full font-bold bg-teal-500 text-white"> Swap </Button>
        </CardBody>
    </Card>)
}