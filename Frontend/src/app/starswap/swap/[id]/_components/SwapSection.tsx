import { BalanceShow } from '@app/_components/Commons/BalanceShow'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Divider, Textarea, Button } from '@nextui-org/react'
import { RootState } from '@redux'
import { TIME_OUT, calcRedenomination, calcIRedenomination } from '@utils'
import { getToken0, getToken0Output, getToken1, getToken1Output, swap, approve, getAllowance, getBalance, getDecimals, getSymbol } from '@web3'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Address } from 'web3'
import { SlippageTolerance } from './SlippageTolerance'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { initialTokenState, tokenReducer } from '@app/starswap/_extras'
import { FetchSpinner } from '@app/_components/Commons/FetchSpinner'

interface SwapSectionProps {
    poolAddress: Address
    className?: string
}

export const SwapSection = (props: SwapSectionProps) => {
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)

    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

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
                props.poolAddress
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
                    props.poolAddress,
                    calcIRedenomination(input, decimals)
                )
            }

            const txHash = await swap(
                web3,
                account,
                props.poolAddress,
                calcIRedenomination(input, decimals),
                calcIRedenomination(minOutput, decimals),
                values.isBuy
            )

            console.log(txHash)
        }
    })

    console.log(formik.values)

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(
        () => {
            const handleEffect = async () => {
                const _token0 = await getToken0(chainName, props.poolAddress)
                if (_token0 == null) return
                tokenDispatch({ type: 'SET_TOKEN0', payload: _token0 })

                const _token1 = await getToken1(chainName, props.poolAddress)
                if (_token1 == null) return
                tokenDispatch({ type: 'SET_TOKEN1', payload: _token1 })

                const _token0Symbol = await getSymbol(chainName, _token0)
                if (_token0Symbol == null) return
                tokenDispatch({ type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol })

                const _token1Symbol = await getSymbol(chainName, _token1)
                if (_token1Symbol == null) return
                tokenDispatch({ type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol })

                const _token0Decimals = await getDecimals(chainName, _token0)
                if (_token0Decimals == null) return
                tokenDispatch({ type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals })

                const _token1Decimals = await getDecimals(chainName, _token1)
                if (_token1Decimals == null) return
                tokenDispatch({ type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals })

                // const _token0Balance = await getBalance(chainName, _token0, account)
                // if (_token0Balance == null) return 
                // tokenDispatch({type: 'SET_TOKEN0_BALANCE', payload: calcRedenomination(_token0Balance, _token0Decimals, 5)})

                // const _token1Balance = await getBalance(chainName, _token1, account)
                // if (_token1Balance == null) return 
                // tokenDispatch({type: 'SET_TOKEN1_BALANCE', payload: calcRedenomination(_token1Balance, _token0Decimals, 5)})

                setFinishLoad(true)
            }
            handleEffect()
        }, []
    )

    const preventLoopToken0 = useRef(false)
    const preventLoopToken1 = useRef(false)

    const [syncToken0, setSyncToken0] = useState(false)
    const [syncToken1, setSyncToken1] = useState(false)

    useEffect(
        () => {
            if (!preventLoopToken0.current) {
                const controller = new AbortController()
                const handleEffect = async () => {
                    const token0Amount = formik.values.token0Amount

                    const _token1Out = await getToken1Output(
                        chainName,
                        props.poolAddress,
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
                        props.poolAddress,
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
                            <TokenShow finishLoad={finishLoad}
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
                                finishLoad={finishLoad} />
                        </div>

                        <Textarea
                            id="token0Amount"
                            description={<FetchSpinner
                                message="Pricing"
                                finishFetch={syncToken0}
                            />}
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
                        <Button variant="light" onPress=
                            {
                                async () => {
                                    formik.setFieldValue('isBuy', !formik.values.isBuy)
                                    formik.setFieldValue('token1Amount', formik.values.token0Amount)

                                    const token0Output = await getToken0Output(
                                        chainName,
                                        props.poolAddress,
                                        calcIRedenomination(formik.values.token0Amount, tokenState.token0Decimals))
                                    
                                    console.log(token0Output)
                                }
                            }
                        isIconOnly radius="full" startContent={<ArrowsUpDownIcon height={24} width={24} />} />
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <TokenShow finishLoad={finishLoad}
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
                                finishLoad={finishLoad} />
                        </div>
                        <Textarea
                            id="token1Amount"
                            description={
                                <FetchSpinner
                                    message="Pricing"
                                    finishFetch={syncToken1}
                                />}
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