'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import { SelectToken } from '@app/starswap/_components/SelectToken'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Fragment, useEffect, useReducer, useState } from 'react'
import { approve, getAllowance, getBalance, getDecimals, getSymbol, createLiquidityPool } from '@web3'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, TransactionType, setTransactionType, setVisible } from '@redux'
import { calcIRedenomination, calcRound, chainInfos, calcRedenomination } from '@utils'
import { BalanceShow } from '@app/_components/Commons/BalanceShow'
import { TokenShow } from '@app/_components/Commons/TokenShow'
import { initialTokenState, tokenReducer } from '@app/starswap/_extras'

export const MainForm = () => {

    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)
    const chainName = useSelector((state: RootState) => state.chainName.chainName)
    const dispatch: AppDispatch = useDispatch()

    const [tokenState, tokenDispatch] = useReducer(tokenReducer, initialTokenState)

    const handleSelectTokenSubmit = (values: {
        tokenAddress: string
    }, isToken0: boolean) => {
        formik.setFieldValue(isToken0 ? 'token0' : 'token1', values.tokenAddress)
    }

    console.log(tokenState)

    const formik = useFormik({
        initialValues: {
            token0: '',
            token1: '',
            isToken0Sell: true,
            token0DepositAmount: 0,
            token1DepositAmount: 0,
            token0BasePrice: 0,
            token0MaxPrice: 0,
            protocolFee: 0.0025
        },

        validationSchema: Yup.object({
            token0: Yup.string()
                .required('This field is required'),
            token1: Yup.string()
                .required('This field is required'),
            isToken0Sell: Yup.boolean(),
            token0DepositAmount: Yup.number()
                .typeError('Input must be a number')
                .typeError('')
                .min(0, 'Input must be greater than or equal to 0')
                .max(tokenState.token0Balance, 'Input must not exceed your available balance')
                .required('This field is required'),
            token1DepositAmount: Yup.number()
                .typeError('Input must be a number')
                .min(0, 'Input must be greater than or equal to 0')
                .max(tokenState.token1Balance, 'Input must not exceed your available balance')
                .required('This field is required'),
            token0BasePrice: Yup.number()
                .typeError('Input must be a number')
                .min(0, 'Input must be greater than or equal to 0').required('This field is required')
                .max(Yup.ref('token0MaxPrice'), 'Min price must be less than or equal to max price'),
            token0MaxPrice: Yup.number()
                .typeError('Input must be a number')
                .min(Yup.ref('token0BasePrice'), 'Max price must be greater than or equal to min price')
                .required('This field is required'),
            protocolFee: Yup.number()
                .typeError('Input must be a number')
                .min(0, 'Input must be greater than or equal to 0').required('This field is required')
        }),

        onSubmit: values => {
            if (web3 == null) return

            const handleSubmit = async () => {
                dispatch(setVisible(true))
                dispatch(setTransactionType(TransactionType.Swap))

                const _factoryAddress = chainInfos[chainName].factoryContract

                const _token0Allowance = await getAllowance(chainName, values.token0, account, _factoryAddress)
                if (_token0Allowance == null) return
                const _iToken0DepositAmount = calcIRedenomination(values.token0DepositAmount, tokenState.token0Decimals)
                if (_token0Allowance < _iToken0DepositAmount) {
                    await approve(
                        web3,
                        account,
                        values.token0,
                        _factoryAddress,
                        _iToken0DepositAmount - _token0Allowance
                    )
                }

                const _token1Allowance = await getAllowance(chainName, values.token1, account, _factoryAddress)
                if (_token1Allowance == null) return
                const _iToken1DepositAmount = calcIRedenomination(values.token1DepositAmount, tokenState.token1Decimals)
                if (_token1Allowance < _iToken1DepositAmount) {
                    await approve(
                        web3,
                        account,
                        values.token1,
                        _factoryAddress,
                        _iToken1DepositAmount - _token1Allowance
                    )
                }

                const _actualToken0 = values.isToken0Sell ? values.token0 : values.token1
                const _actualToken1 = values.isToken0Sell ? values.token1 : values.token0
                const _actualToken0DepositAmount = values.isToken0Sell ? _iToken0DepositAmount : _iToken1DepositAmount
                const _actualToken1DepositAmount = values.isToken0Sell ? _iToken1DepositAmount : _iToken0DepositAmount

                const txHash = await createLiquidityPool(
                    web3,
                    chainName,
                    account,
                    _actualToken0,
                    _actualToken1,
                    _actualToken0DepositAmount,
                    _actualToken1DepositAmount,
                    calcIRedenomination(values.token0BasePrice, tokenState.token0Decimals),
                    calcIRedenomination(values.token0MaxPrice, tokenState.token1Decimals),
                    calcIRedenomination(values.protocolFee, 5)
                )

                console.log(txHash)
            }
            handleSubmit()
        }
    })

    console.log(formik.values)

    const [finishLoad, setFinishLoad] = useState(false)

    useEffect(() => {

        const token0 = formik.values.token0
        const token1 = formik.values.token1
        console.log(token0 + token1)
        if (token0 && token1) {
            const handleEffect = async () => {
                const _token0Symbol = await getSymbol(chainName, formik.values.token0)
                if (_token0Symbol == null) return
                tokenDispatch({ type: 'SET_TOKEN0_SYMBOL', payload: _token0Symbol })

                const _token1Symbol = await getSymbol(chainName, formik.values.token1)
                if (_token1Symbol == null) return
                tokenDispatch({ type: 'SET_TOKEN1_SYMBOL', payload: _token1Symbol })

                const _token0Decimals = await getDecimals(chainName, formik.values.token0)
                if (_token0Decimals == null) return
                tokenDispatch({ type: 'SET_TOKEN0_DECIMALS', payload: _token0Decimals })

                const _token1Decimals = await getDecimals(chainName, formik.values.token1)
                if (_token1Decimals == null) return
                tokenDispatch({ type: 'SET_TOKEN1_DECIMALS', payload: _token1Decimals })

                const _token0Balance = await getBalance(chainName, formik.values.token0, account)
                if (_token0Balance == null) return
                tokenDispatch({ type: 'SET_TOKEN0_BALANCE', payload: calcRedenomination(_token0Balance, _token0Decimals, 5) })

                const _token1Balance = await getBalance(chainName, formik.values.token1, account)
                if (_token1Balance == null) return
                tokenDispatch({ type: 'SET_TOKEN1_BALANCE', payload: calcRedenomination(_token1Balance, _token0Decimals, 5) })

                setFinishLoad(true)
            }
            handleEffect()
        }

    }, [formik.values])

    const protocolFees = [
        {
            id: 0,
            title: '0.25%'
        },
        {
            id: 1,
            title: '0.5%',
        },
        {
            id: 2,
            title: '1%',
        },
        {
            id: 3,
            title: '2.5%',
        }
    ]

    return (
        <div>
            <Card>
                <CardHeader className='font-bold p-5'> Create Liquidity Pool </CardHeader>
                <Divider />
                <CardBody>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-2 gap-12">
                            <div className="sm:col-span-1 col-span-2">
                                <div>
                                    <div className="text-sm font-bold text-teal-500"> Choose Token Pair </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        <SelectToken
                                            chainName={chainName}
                                            className="grow"
                                            tokenAddress={formik.values.token0}
                                            otherTokenAddress={formik.values.token1}
                                            handleSubmit={values => handleSelectTokenSubmit(values, true)} />
                                        <PlusIcon height={24} width={24} />
                                        <SelectToken
                                            chainName={chainName}
                                            className="grow"
                                            tokenAddress={formik.values.token1}
                                            otherTokenAddress={formik.values.token0}
                                            handleSubmit={values => handleSelectTokenSubmit(values, false)} />
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <div className="text-sm font-bold text-teal-500"> Pick Protocol Fee Tier </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        {protocolFees.map((fee) =>
                                            (<Card key={fee.id} 
                                                className={`flex-1 ${formik.values.protocolFee === Number.parseFloat(fee.title) / 100 ? 'bg-teal-500' : ''}`} 
                                                isPressable = {finishLoad}
                                                onPress={() =>
                                                    formik.setFieldValue('protocolFee', Number.parseFloat(fee.title) / 100)
                                                }>
                                                <CardBody className="font-bold text-center">
                                                    {fee.title}
                                                </CardBody>
                                            </Card>)
                                        )}
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <div className="text-sm font-bold text-teal-500"> Deposit Token </div>

                                    <Select
                                        size="sm"
                                        isDisabled={!finishLoad}
                                        items={(tokenState.token0Symbol && tokenState.token1Symbol) ? [
                                            {
                                                address: formik.values.token0,
                                                symbol: tokenState.token0Symbol
                                            },
                                            {
                                                address: formik.values.token1,
                                                symbol: tokenState.token1Symbol
                                            }
                                        ] : []}
                                        label="Sell Token"
                                        className="mt-6"
                                        onChange={event => formik.setFieldValue('isToken0Sell', formik.values.token0 == event.target.value)}
                                        selectedKeys = {(tokenState.token0Symbol && tokenState.token1Symbol) 
                                            ? [formik.values.isToken0Sell 
                                                ? formik.values.token0 
                                                : formik.values.token1
                                            ] : undefined
                                        }
                                    >
                                        {(token) => <SelectItem
                                            key={token.address}>{token.symbol}</SelectItem>}
                                    </Select>

                                    <div className="grid grid-cols-2 gap-4 mt-5 ">
                                        <div>
                                            <div className="flex justify-between">
                                                <TokenShow finishLoad={finishLoad} symbol={tokenState.token0Symbol} />
                                                <BalanceShow balance={tokenState.token0Balance} finishLoad={finishLoad} />
                                            </div>
                                            <Input
                                                id="token0DepositAmount"
                                                isDisabled={!finishLoad}
                                                size="sm"
                                                className="mt-1"
                                                label='Amount'
                                                variant="bordered"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.errors.token0DepositAmount != undefined}
                                                errorMessage={formik.errors.token0DepositAmount}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between">
                                                <TokenShow finishLoad={finishLoad} symbol={tokenState.token1Symbol} />
                                                <BalanceShow balance={tokenState.token1Balance} finishLoad={finishLoad} />
                                            </div>
                                            <Input
                                                id="token1DepositAmount"
                                                isDisabled={!finishLoad}
                                                size="sm"
                                                className="mt-1"
                                                label='Amount'
                                                variant="bordered"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={(formik.errors.token1DepositAmount && formik.touched.token1DepositAmount) != undefined}
                                                errorMessage={formik.errors.token1DepositAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-1 col-span-2 h-full justify-between flex flex-col"  >
                                <div>
                                    <div className="text-sm font-bold text-teal-500"> Set Price Range </div>
                                    <div className="mt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <Card>
                                                    <CardHeader className="p-5">
                                                        <div className="font-bold text-center w-full text-sm">
                                                            Base Price
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="items-center flex gap-4">
                                                            <Button variant="flat"
                                                                isDisabled= {!finishLoad}
                                                                onClick={() => formik.setFieldValue('token0BasePrice', formik.values.token0BasePrice - 1)}
                                                                isIconOnly radius="full" className="flex-none w-6 h-6 min-w-0">
                                                                <MinusIcon height={12} width={12} />
                                                            </Button>
                                                            <Input
                                                                id="token0BasePrice"
                                                                isDisabled= {!finishLoad}
                                                                className="flex-1"
                                                                variant="flat"
                                                                classNames={{
                                                                    'input': 'text-center'
                                                                }}
                                                                value={formik.values.token0BasePrice.toString()}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                isInvalid={formik.errors.token0BasePrice != undefined}
                                                            />
                                                            <Button variant="flat"
                                                                isDisabled= {!finishLoad}
                                                                onClick={() => formik.setFieldValue('token0BasePrice', formik.values.token0BasePrice + 1)}
                                                                isIconOnly radius="full"
                                                                className="flex-none w-6 h-6 min-w-0">
                                                                <PlusIcon height={12} width={12} className="p-0" />
                                                            </Button>

                                                        </div>
                                                    </CardBody>

                                                    <CardFooter className="p-4">
                                                        <div className="text-center w-full text-sm">
                                                            {finishLoad
                                                                ? <Fragment> {calcRound(formik.values.token0BasePrice, 3)} <span className="font-bold">{!formik.values.isToken0Sell
                                                                    ? tokenState.token0Symbol
                                                                    : tokenState.token1Symbol}</span> per <span className="font-bold">{!formik.values.isToken0Sell
                                                                    ? tokenState.token1Symbol
                                                                    : tokenState.token0Symbol}</span> </Fragment>
                                                                : null}
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                                {
                                                    formik.errors.token0BasePrice
                                                        ? <div className="text-xs text-danger pt-1 px-1"> {formik.errors.token0BasePrice}</div>
                                                        : null
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <Card>
                                                    <CardHeader className="p-5">
                                                        <div className="font-bold text-center w-full text-sm">
                                                            Max Price
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="items-center flex gap-3">
                                                            <Button
                                                                isDisabled= {!finishLoad}
                                                                variant="flat"
                                                                onClick={() => formik.setFieldValue('token0MaxPrice', formik.values.token0MaxPrice - 1)}
                                                                isIconOnly radius="full" className="flex-none w-6 h-6 min-w-0">
                                                                <MinusIcon height={12} width={12} />
                                                            </Button>
                                                            <Input
                                                                id="token0MaxPrice"
                                                                isDisabled= {!finishLoad}
                                                                className="flex-1"
                                                                variant="flat"
                                                                classNames={{
                                                                    'input': 'text-center'
                                                                }}
                                                                value={formik.values.token0MaxPrice.toString()}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                isInvalid={formik.errors.token0MaxPrice != undefined}
                                                            />
                                                            <Button
                                                                variant="flat"
                                                                isDisabled= {!finishLoad}   
                                                                onClick={() => formik.setFieldValue('token0MaxPrice', formik.values.token0MaxPrice + 1)}
                                                                isIconOnly radius="full" className="flex-none w-6 h-6 min-w-0">
                                                                <PlusIcon height={12} width={12} />
                                                            </Button>

                                                        </div>
                                                    </CardBody>
                                                    <CardFooter className="p-4">
                                                        <div className="text-center w-full text-sm">
                                                            {finishLoad
                                                                ? <Fragment> {calcRound(formik.values.token0MaxPrice, 3)} <span className="font-bold">{
                                                                    !formik.values.isToken0Sell
                                                                        ? tokenState.token0Symbol
                                                                        : tokenState.token1Symbol}</span> per <span className="font-bold">{!formik.values.isToken0Sell
                                                                    ? tokenState.token1Symbol
                                                                    : tokenState.token0Symbol}</span> </Fragment>
                                                                : null}
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                                {
                                                    formik.errors.token0MaxPrice
                                                        ? <div className="text-xs text-danger pt-1 px-1"> {formik.errors.token0MaxPrice}</div>
                                                        : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                                <Button
                                    size="lg" type="submit" className="mt-12 w-full font-bold bg-teal-500 text-white"> Create </Button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>

        </div >
    )
}