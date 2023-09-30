import { BalanceShow } from '@app/_components/Commons/BalanceShow'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Divider, Textarea, Button, Spinner } from '@nextui-org/react'
import { RootState } from '@redux/store'
import { TIME_OUT, calcRedenomination, calcNRedenomination, calcInt } from '@utils'
import { approve, getAllowance, getBalance, getDecimals, getSymbol } from '@web3/contracts/erc20'
import { getToken0, getToken0Output, getToken1, getToken1Output, swap } from '@web3/contracts/liquidity-pool/liquidity-pool.contract'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'web3'
import { SlippageTolerance } from './SlippageTolerance'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface SwapSectionProps {
    poolAddress: Address
    className?: string
}

export const SwapSection = (props: SwapSectionProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)

    const formik = useFormik({
        initialValues: {
            token0Amount: 0,
            token1Amount: 0,
            slippage: 0.01,
            isBuy: false
        },

        validationSchema: Yup.object({
            token0Amount: Yup.number()
                .typeError('Input must be a number')
                .min(0, 'Input must be greater than or equal to 0')
                .required('This field is required'),
            token1Amount: Yup.number()
                .typeError('Input must be a number')
                .min(0, 'Input must be greater than or equal to 0')
                .required('This field is required'),
        }),
        onSubmit: async (values) => {

            const _tokenAllowance = await getAllowance(chainName,
                values.isBuy ? token1! : token0!,
                account!,
                props.poolAddress
            )

            const input = values.isBuy ? values.token1Amount : values.token0Amount
            const output = values.isBuy ? values.token0Amount : values.token1Amount
            const decimals = values.isBuy ? token1Decimals! : token0Decimals!
            const minOutput = output * (1 - values.slippage)
            if (calcInt(_tokenAllowance) < Number.parseInt(calcNRedenomination(input, decimals!)!)) {
                await approve(
                    web3!,
                    account!,
                    values.isBuy ? token1! : token0!,
                    props.poolAddress,
                    calcNRedenomination(input, decimals)!
                )
            }

            const tx = await swap(
                web3!,
                chainName,
                account!,
                props.poolAddress,
                calcNRedenomination(input,
                    values.isBuy
                        ? token1Decimals!
                        : token0Decimals!)!,
                calcNRedenomination(minOutput, decimals)!,
                values.isBuy
            )

            console.log(account, props.poolAddress + calcNRedenomination(input, token1Decimals!)! + calcNRedenomination(minOutput, token1Decimals!)!)
        }
    })

    console.log(formik.values)

    const [token0, setToken0] = useState<string | null>(null)
    const [token1, setToken1] = useState<string | null>(null)

    const [token0Symbol, setToken0Symbol] = useState<string | null>(null)
    const [token1Symbol, setToken1Symbol] = useState<string | null>(null)

    const [token0Balance, setToken0Balance] = useState<number>(0)
    const [token1Balance, setToken1Balance] = useState<number>(0)

    const [token0Decimals, setToken0Decimals] = useState<number | null>(null)
    const [token1Decimals, setToken1Decimals] = useState<number | null>(null)

    const [finishLoad, setFinishLoad] = useState(false)

    console.log(token0)
    
    useEffect(
        () => {
            const handleEffect = async () => {
                const _token0 = await getToken0(chainName, props.poolAddress)
                const _token1 = await getToken1(chainName, props.poolAddress)
        
                setToken0(_token0)
                setToken1(_token1)

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

                    setToken0Balance(calcRedenomination(_token0Balance, _token0Decimals, 5))
                    setToken1Balance(calcRedenomination(_token1Balance, _token1Decimals, 5))
                }

                setToken0Symbol(_token0Symbol)
                setToken1Symbol(_token1Symbol)


                setFinishLoad(true)
            }
            handleEffect()
        }
        , []
    )

    const preventLoopToken0 = useRef(false)
    const preventLoopToken1 = useRef(false)

    const [syncToken0, setSyncToken0] = useState(false)
    const [syncToken1, setSyncToken1] = useState(false)

    useEffect(
        () => {
            if (!preventLoopToken0.current) {
                console.log('called 0')
                const controller = new AbortController()
                const handleEffect = async () => {
                    const token0Amount = formik.values.token0Amount

                    const _token1Out = await getToken1Output(
                        chainName,
                        controller,
                        props.poolAddress,
                        calcNRedenomination(token0Amount, token0Decimals!)!
                    )
                    if (_token1Out != null) {
                        formik.setFieldValue('token1Amount', calcRedenomination(_token1Out, token1Decimals!, 5))
                    }
                    setSyncToken1(false)
                }
                const delayDebounceFn = setTimeout(() => handleEffect(), TIME_OUT)

                preventLoopToken1.current = true
                return () => {
                    controller.abort()
                    clearTimeout(delayDebounceFn)
                }
            } else {
                preventLoopToken0.current = false
            }
        }, [formik.values.token0Amount])

    useEffect(
        () => {
            if (!preventLoopToken1.current) {
                console.log('called 1')
                const controller = new AbortController()
                const handleEffect = async () => {
                    const token1Amount = formik.values.token1Amount

                    const _token0Out = await getToken0Output(
                        chainName,
                        controller,
                        props.poolAddress,
                        calcNRedenomination(token1Amount, token1Decimals!)!
                    )
                    console.log(calcNRedenomination(token1Amount, token1Decimals!)!)
                    if (_token0Out != null) {
                        formik.setFieldValue('token0Amount', calcRedenomination(_token0Out, token0Decimals!, 5))
                    }
                    setSyncToken0(false)
                }
                const delayDebounceFn = setTimeout(() => handleEffect(), TIME_OUT)

                preventLoopToken0.current = true
                return () => {
                    controller.abort()
                    clearTimeout(delayDebounceFn)
                }
            } else {
                preventLoopToken1.current = false
            }
        }, [formik.values.token1Amount])



    return (<Card className={`w-full ${props.className}`}>
        <CardHeader className='font-bold p-5'> Swap </CardHeader>
        <Divider />
        <CardBody>
            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">               
                    <div>
                        <div className="flex justify-between">
                            <TokenShow finishLoad={finishLoad} symbol={token0Symbol!} />
                            <BalanceShow balance={token0Balance} finishLoad={finishLoad} />
                        </div>

                        <Textarea
                            id="token0Amount"
                            description={
                                syncToken0
                                    ? <div className="gap-2 flex items-center"> <Spinner color="default" size="sm" /> <div className="text-sm"> Pricing </div> </div>
                                    : null}
                            maxRows={2}
                            value={formik.values.token0Amount?.toString()}
                            onChange={
                                event => {
                                    formik.handleChange(event)
                                    setSyncToken1(true)
                                }
                            }
                            onBlur={formik.handleBlur}
                            isInvalid={formik.errors.token0Amount != undefined}
                            errorMessage={formik.errors.token0Amount}
                            isDisabled={syncToken0}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Button variant="light" isIconOnly radius="full" startContent={<ArrowsUpDownIcon height={24} width={24} />} />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <TokenShow finishLoad={finishLoad} image="/icons/stable-coins/USDT.svg" symbol={token1Symbol!} />
                            <BalanceShow balance={token1Balance} finishLoad={finishLoad} />
                        </div>
                        <Textarea
                            id="token1Amount"
                            description={
                                syncToken1
                                    ? <div className="gap-2 flex items-center"> <Spinner color="default" size="sm" /> <div className="text-sm"> Pricing </div> </div>
                                    : null}
                            maxRows={2}
                            value={formik.values.token1Amount?.toString()}
                            onChange={
                                event => {
                                    formik.handleChange(event)
                                    setSyncToken0(true)
                                }
                            }
                            onBlur={formik.handleBlur}
                            isInvalid={formik.errors.token1Amount != undefined}
                            errorMessage={formik.errors.token1Amount}
                            isDisabled={syncToken1}
                        />
                    </div>
                </div>
                <SlippageTolerance className="mt-6" />
                <Button
                    size="lg" type="submit" className="mt-6 w-full font-bold bg-teal-500 text-white"> Swap </Button>
            </form>
        </CardBody>
    </Card>)
}