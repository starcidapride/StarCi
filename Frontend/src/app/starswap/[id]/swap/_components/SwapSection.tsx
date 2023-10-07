import { BalanceShow } from '@app/_components/Commons/BalanceShow'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Divider, Textarea, Button } from '@nextui-org/react'
import { RootState } from '@redux'
import { TIME_OUT, calcRedenomination, calcIRedenomination } from '@utils'
import { getToken0Output, getToken1Output, swap, approve, getAllowance } from '@web3'
import { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SlippageTolerance } from './SlippageTolerance'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FetchSpinner } from '@app/_components/Commons/FetchSpinner'
import { PoolAddressContext, TokenContext } from '../../layout'

interface SwapSectionProps {
    className?: string
}

export const SwapSection = (props: SwapSectionProps) => {
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)
    const web3 = useSelector((state: RootState) => state.blockchain.web3)
    const account = useSelector((state: RootState) => state.blockchain.account)

    const tokenState = useContext(TokenContext)
    const poolAddress = useContext(PoolAddressContext)

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
                .required('This field is required')
        }),
        onSubmit: async (values) => {

            if (web3 == null) return

            const _tokenAllowance = await getAllowance(
                chainName,
                values.isBuy ? tokenState.token1 : tokenState.token0,
                account,
                poolAddress
            )

            if (_tokenAllowance == null) return

            const input = values.isBuy ? values.token1Amount : values.token0Amount
            const output = values.isBuy ? values.token0Amount : values.token1Amount
            const token = values.isBuy ? tokenState.token1 : tokenState.token0
            const decimals = values.isBuy ? tokenState.token1Decimals : tokenState.token0Decimals
            const minOutput = output * (1 - values.slippage)

            if (_tokenAllowance < calcIRedenomination(input, decimals)) {
                await approve(
                    web3,
                    account,
                    token,
                    poolAddress,
                    calcIRedenomination(input, decimals)
                )
            }

            const txHash = await swap(
                web3,
                account,
                poolAddress,
                calcIRedenomination(input, decimals),
                calcIRedenomination(minOutput, decimals),
                values.isBuy
            )

            console.log(txHash)
        }
    })

    console.log(formik.values)

    const preventLoopToken0 = useRef(false)
    const preventLoopToken1 = useRef(false)

    const [syncToken0, setSyncToken0] = useState(false)
    const [syncToken1, setSyncToken1] = useState(false)

    const [preventExecutionToken0, setPreventExecutionToken0] = useState(false)
    const [preventExecutionToken1, setPreventExecutionToken1] = useState(false)

    const firstLoadToken0 = useRef(true)
    const firstLoadToken1 = useRef(true)

    useEffect(
        () => {
            if (firstLoadToken0.current) {
                firstLoadToken0.current = false
                return
            }
            if (preventExecutionToken0 == true) return

            if (!preventLoopToken0.current) {
                console.log('called 0')
                const controller = new AbortController()
                const handleEffect = async () => {
                    const token0Amount = formik.values.token0Amount

                    const _token1Out = await getToken1Output(
                        chainName,
                        poolAddress,
                        calcIRedenomination(token0Amount, tokenState.token0Decimals),
                        controller
                    )

                    if (_token1Out != null) {
                        formik.setFieldValue('token1Amount', calcRedenomination(
                            _token1Out,
                            tokenState.token1Decimals,
                            5
                        ))
                    }

                    setSyncToken1(false)
                }
                const delayDebounceFn = setTimeout(() => handleEffect(), TIME_OUT)

                preventLoopToken1.current = true

                setPreventExecutionToken1(false)
                return () => {
                    controller.abort()
                    clearTimeout(delayDebounceFn)
                }
            } else {
                preventLoopToken0.current = false
            }
        }, [formik.values.token0Amount, formik.values.isBuy])

    useEffect(
        () => {
            if (firstLoadToken1.current) {
                firstLoadToken1.current = false
                return
            }

            if (preventExecutionToken1 == true) return

            if (!preventLoopToken1.current) {
                console.log('called 1')
                const controller = new AbortController()
                const handleEffect = async () => {
                    const token1Amount = formik.values.token1Amount

                    const _token0Out = await getToken0Output(
                        chainName,
                        poolAddress,
                        calcIRedenomination(token1Amount, tokenState.token1Decimals),
                        controller
                    )

                    if (_token0Out != null) {
                        formik.setFieldValue('token0Amount', calcRedenomination(_token0Out, tokenState.token1Decimals, 5))
                    }

                    setSyncToken0(false)
                }
                const delayDebounceFn = setTimeout(() => handleEffect(), TIME_OUT)

                preventLoopToken0.current = true

                setPreventExecutionToken0(false)
                return () => {
                    controller.abort()
                    clearTimeout(delayDebounceFn)
                }
            } else {
                preventLoopToken1.current = false
            }
        }, [formik.values.token1Amount, formik.values.isBuy])



    return (
        <Card className={`w-full ${props.className}`}>
            <CardHeader className='font-bold p-5'> Swap </CardHeader>
            <Divider />
            <CardBody>
                <form onSubmit={formik.handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between">
                                <TokenShow finishLoad={tokenState.finishLoadWithoutAuth}
                                    symbol={
                                        !formik.values.isBuy
                                            ? tokenState.token0Symbol
                                            : tokenState.token1Symbol
                                    } />
                                <BalanceShow
                                    balance={
                                        !formik.values.isBuy
                                            ? tokenState.token0Balance
                                            : tokenState.token1Balance
                                    }
                                    finishLoad={tokenState.finishLoadWithAuth} />
                            </div>

                            <Textarea
                                id={!formik.values.isBuy ? 'token0Amount' : 'token1Amount'}
                                description={<FetchSpinner
                                    message="Pricing"
                                    finishFetch={!formik.values.isBuy ? syncToken0 : syncToken1}
                                />}
                                maxRows={2}
                                value={
                                    !formik.values.isBuy
                                        ? formik.values.token0Amount?.toString()
                                        : formik.values.token1Amount?.toString()
                                }
                                onChange={
                                    event => {
                                        formik.handleChange(event)
                                        !formik.values.isBuy
                                            ? setSyncToken1(true)
                                            : setSyncToken0(true)
                                    }
                                }
                                onBlur={formik.handleBlur}
                                isInvalid={(!formik.values.isBuy ? formik.errors.token0Amount : formik.errors.token1Amount) != undefined}
                                errorMessage={(!formik.values.isBuy ? formik.errors.token0Amount : formik.errors.token1Amount)}
                                isDisabled={!formik.values.isBuy ? syncToken0 : syncToken1}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button variant="light" 
                                isDisabled={syncToken0 || syncToken1}
                                onPress=
                                    {
                                        async () => {
                                            setPreventExecutionToken0(!formik.values.isBuy)
                                            setSyncToken0(!formik.values.isBuy)
                                    
                                            setPreventExecutionToken1(formik.values.isBuy)
                                            setSyncToken1(formik.values.isBuy)

                                            formik.setFieldValue('isBuy', !formik.values.isBuy) 
                                        }
                                    }
                                isIconOnly radius="full" startContent={<ArrowsUpDownIcon height={24} width={24} />} />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <TokenShow finishLoad={tokenState.finishLoadWithoutAuth}
                                    symbol={
                                        formik.values.isBuy
                                            ? tokenState.token0Symbol
                                            : tokenState.token1Symbol
                                    } />
                                <BalanceShow
                                    balance={
                                        formik.values.isBuy
                                            ? tokenState.token0Balance
                                            : tokenState.token1Balance
                                    }
                                    finishLoad={tokenState.finishLoadWithAuth} />
                            </div>
                            <Textarea
                                id={!formik.values.isBuy ? 'token1Amount' : 'token0Amount'}
                                description={
                                    <FetchSpinner
                                        message="Pricing"
                                        finishFetch={!formik.values.isBuy ? syncToken1 : syncToken0}
                                    />}
                                maxRows={2}
                                value={
                                    !formik.values.isBuy
                                        ? formik.values.token1Amount?.toString()
                                        : formik.values.token0Amount?.toString()
                                }
                                onChange={
                                    event => {
                                        formik.handleChange(event)

                                        !formik.values.isBuy
                                            ? setSyncToken0(true)
                                            : setSyncToken1(true)
                                    }
                                }
                                onBlur={formik.handleBlur}
                                isInvalid={
                                    (!formik.values.isBuy
                                        ? formik.errors.token1Amount
                                        : formik.errors.token0Amount)
                                != undefined}
                                errorMessage={!formik.values.isBuy
                                    ? formik.errors.token1Amount
                                    : formik.errors.token0Amount
                                }
                                isDisabled={!formik.values.isBuy ? syncToken1 : syncToken0}
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