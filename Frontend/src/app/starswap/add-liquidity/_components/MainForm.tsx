'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import { ChooseToken } from './ChooseToken'
import { ArrowsRightLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ChainName } from '@utils/constant.utils'
import { Fragment, useEffect, useState } from 'react'
import { getBalance, getDecimals, getSymbol } from '@web3/contracts/erc20'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { calcReverse, calcBalance, calcRound, calcExponent } from '@utils/calc.utils'
import { createLiquidityPool } from '@web3/contracts/factory/factory.contract'
import { TransactionType, setTransactionType, setVisible } from '@redux/slices/confirm-transaction.slice'
import { ConfirmTransaction } from '@app/_components/ConfirmTransaction'
import { SwapTransactionToast } from '.'

export const MainForm = () => {
    
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)
    const dispatch : AppDispatch = useDispatch()

    const handleSelectTokenSubmit = (values: {
        tokenAddress: string
    }, isToken0: boolean) => {
        formik.setFieldValue(isToken0 ? 'token0' : 'token1', values.tokenAddress)
    }

    const [token0Balance, setToken0Balance] = useState<number>(0)
    const [token1Balance, setToken1Balance] = useState<number>(0)

    const formik = useFormik({
        initialValues: {
            token0: '',
            token1: '',
            isToken0Sell: true,
            token0MaxAmount: 0,
            token1MaxAmount: 0,
            token1MinPrice: 0,
            token1MaxPrice: 0,
            protocolFee: 0
        },

        validationSchema: Yup.object({
            token0: Yup.string()
                .required('This field is required'),
            token1: Yup.string()
                .required('This field is required'),
            token0MaxAmount: Yup.number()
                .min(0, 'Input must be greater than or equal to 0')
                .max(token0Balance, '"Input must not exceed your available balance')
                .required('This field is required'),
            token1MaxAmount: Yup
                .number().min(0, 'Input must be greater than or equal to 0')
                .max(token1Balance, '"Input must not exceed your available balance')
                .required('This field is required'),
            token1MinPrice: Yup.number()
                .min(0, 'Input must be greater than or equal to 0').required('This field is required')
                .max(Yup.ref('token1MaxPrice'), 'Min price must be less than or equal to max price'),
            token1MaxPrice: Yup.number()
                .min(Yup.ref('token1MinPrice'), 'Max price must be greater than or equal to min price')
                .required('This field is required'),
            protocolFee: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
        }),

        onSubmit: values => {
            console.log((values.protocolFee * calcExponent(5)).toString() )
            console.log((values.token1MinPrice * calcExponent(token1Decimals!)).toString())

            const handleSubmit = async () => {
                dispatch(setVisible(true))
                dispatch(setTransactionType(TransactionType.Swap))
                const tx = await createLiquidityPool(
                    web3!,
                    ChainName.KalytnTestnet,
                    account!,
                    values.token0,
                    values.token1,
                    (values.token0MaxAmount * calcExponent(token0Decimals!)).toString(),
                    (values.token1MaxAmount * calcExponent(token1Decimals!)).toString(),
                    (values.token1MinPrice * calcExponent(token1Decimals!)).toString(),
                    (values.token1MaxPrice * calcExponent(token1Decimals!)).toString(),
                    (values.protocolFee * calcExponent(5)).toString() 
                )    
            }
            handleSubmit()
        }
    })

    const [finishLoad, setFinishLoad] = useState(false)

    const [token0Symbol, setToken0Symbol] = useState<string|null>(null)
    const [token1Symbol, setToken1Symbol] = useState<string|null>(null)

    const [token0Decimals, setToken0Decimals] = useState<number|null>(null)
    const [token1Decimals, setToken1Decimals] = useState<number|null>(null)

    const [reverse, setReverse] = useState(false)

    useEffect(() => {
        const token0 = formik.values.token0
        const token1 = formik.values.token1
        if (token0 && token1) {
            
            const handleEffect = async () => {
                const _token0Symbol = await getSymbol(ChainName.KalytnTestnet, formik.values.token0)
                const _token1Symbol = await getSymbol(ChainName.KalytnTestnet, formik.values.token1)
                
                setToken0Symbol(_token0Symbol)
                setToken1Symbol(_token1Symbol)

                const _token0Decimals = await getDecimals(ChainName.KalytnTestnet, formik.values.token0)
                const _token1Decimals = await getDecimals(ChainName.KalytnTestnet, formik.values.token1)
                
                setToken0Decimals(Number.parseInt(_token0Decimals.toString()))
                setToken1Decimals(Number.parseInt(_token1Decimals.toString()))
                
                if (web3 && account) {
                    const _token0Balance = await getBalance(ChainName.KalytnTestnet, formik.values.token0, account)
                    const _token1Balance = await getBalance(ChainName.KalytnTestnet, formik.values.token1, account)
                    
                    setToken0Balance(calcBalance(_token0Balance, _token0Decimals, 5))
                    setToken1Balance(calcBalance(_token1Balance, _token1Decimals, 5))
                }
                
                setToken0Symbol(_token0Symbol)
                setToken1Symbol(_token1Symbol)

                setFinishLoad(true)
            }
            handleEffect()
        }

    }, [formik.values])

    const protocolFees = [
        {   
            title: '0.25%'
        },
        {
            title: '0.5%',
        },
        {
            title: '1%',
        },
        {
            title: '2.5%',
        }
    ]

    return (
        <div>
            <Card>
                <CardHeader className='font-bold p-5'> Add Liquidity </CardHeader>
                <Divider />
                <CardBody>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-2 gap-12">
                            <div className="sm:col-span-1 col-span-2">
                                <div>
                                    <div className="text-sm font-bold text-teal-500"> Choose Token Pair </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        <ChooseToken
                                            chainName={ChainName.KalytnTestnet}
                                            className="grow"
                                            tokenAddress={formik.values.token0}
                                            otherTokenAddress={formik.values.token1}
                                            handleSubmit={values => handleSelectTokenSubmit(values, true)} />
                                        <PlusIcon height={24} width={24} />
                                        <ChooseToken
                                            chainName={ChainName.KalytnTestnet}
                                            className="grow"
                                            tokenAddress={formik.values.token1}
                                            otherTokenAddress={formik.values.token0}
                                            handleSubmit={values => handleSelectTokenSubmit(values, false)} />
                                    </div>
                                </div>
                                <div className="mt-12">
                                    <div className="text-sm font-bold text-teal-500"> Pick Protocol Fee Tier </div>
                                    <div className="flex items-center gap-4 mt-6">
                                        {protocolFees.map((fee, index) =>
                                            (<Card key={index} className={`flex-1 ${ formik.values.protocolFee === Number.parseFloat(fee.title) / 100 ? 'bg-teal-500' : ''}`} isPressable
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
                                        isDisabled={!finishLoad}
                                        items={ (token0Symbol && token1Symbol) ? [
                                            {
                                                address: formik.values.token0,
                                                symbol: token0Symbol
                                            },
                                            { 
                                                address: formik.values.token1,
                                                symbol: token1Symbol
                                            }
                                        ] : [] }
                                        label="Sell Token"
                                        className="mt-6"
                                        onChange={event => formik.setFieldValue('isToken0Sell', formik.values.token0 == event.target.value)}
                                    >
                                        {(token) => <SelectItem 
                                            key={token.address}>{token.symbol}</SelectItem>}
                                    </Select>
                                        
                                    <div className="grid grid-cols-2 gap-4 mt-3">
                                        <div>
                                            <div className="text-xs text-end col-span-1"> Balance : {token0Balance}</div>
                                            <Input
                                                id="token0MaxAmount"
                                                isDisabled={!finishLoad}
                                                type="number"
                                                className="mt-1"
                                                label={token0Symbol ?? 'Token'}
                                                variant="bordered"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.errors.token0MaxAmount ? true : false}
                                                errorMessage={formik.errors.token0MaxAmount}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-xs text-end col-span-1"> Balance : {token1Balance}</div>
                                            <Input
                                                id="token1MaxAmount"
                                                isDisabled={!finishLoad}
                                                type="number"
                                                className="mt-1"
                                                label={token1Symbol ?? 'Token'}
                                                variant="bordered"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                isInvalid={formik.errors.token1MaxAmount ? true : false}
                                                errorMessage={formik.errors.token1MaxAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1 col-span-2 h-full justify-between flex flex-col">
                                <div>
                                    <div className="text-sm font-bold text-teal-500"> Set Price Range </div>
                                    <div className="mt-6">  
                                        <div className="flex items-start gap-4">
                                            <div className="flex-1">
                                                <Card>
                                                    <CardHeader className="p-5">
                                                        <div className="font-bold text-center w-full text-sm">
                                                    Min Price
                                                        </div>
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="items-center flex gap-4">
                                                            <Button onClick={() => formik.setFieldValue('token1MinPrice', formik.values.token1MinPrice - 1)} isIconOnly radius="full" className="flex-none" size="sm">
                                                                <MinusIcon height={16} width={16} />
                                                            </Button>
                                                            <Input
                                                                id="token1MinPrice"
                                                                className="flex-1"
                                                                type="number"
                                                                variant="flat"
                                                                classNames={{
                                                                    'input': 'text-center'
                                                                }}
                                                                value={formik.values.token1MinPrice.toString()}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                isInvalid={formik.errors.token1MinPrice ? true : false}
                                                            />
                                                            <Button onClick={() => formik.setFieldValue('token1MinPrice', formik.values.token1MinPrice + 1)} isIconOnly radius="full" className="flex-none" size="sm">
                                                                <PlusIcon height={16} width={16} />
                                                            </Button>

                                                        </div>
                                                    </CardBody>
                                                    <CardFooter className="p-4">
                                                        <div className="text-center w-full text-sm">
                                                            {!finishLoad ? '' : (!reverse
                                                                ? <Fragment> {calcRound(formik.values.token1MinPrice, 3)} <span className="font-bold">{formik.values.isToken0Sell ? token0Symbol : token1Symbol}</span> per <span className="font-bold">{formik.values.isToken0Sell ? token1Symbol : token0Symbol}</span> </Fragment> 
                                                                : <Fragment> {calcReverse(formik.values.token1MinPrice, 3)} <span className="font-bold">{formik.values.isToken0Sell ? token1Symbol : token0Symbol}</span> per <span className="font-bold">{formik.values.isToken0Sell ? token0Symbol : token1Symbol}</span> </Fragment>) } 
                                                        </div>
                                                    </CardFooter>
                                                </Card>  
                                                {
                                                    formik.errors.token1MinPrice
                                                        ? <div className="text-xs text-danger pt-1 px-1"> {formik.errors.token1MinPrice}</div>
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
                                                            <Button onClick={() => formik.setFieldValue('token1MaxPrice', formik.values.token1MaxPrice - 1)} isIconOnly radius="full" className="flex-none" size="sm">
                                                                <MinusIcon height={16} width={16} />
                                                            </Button>
                                                            <Input
                                                                id="token1MaxPrice"
                                                                className="flex-1"
                                                                type="number"
                                                                variant="flat"
                                                                classNames={{
                                                                    'input': 'text-center'
                                                                }}
                                                                value={formik.values.token1MaxPrice.toString()}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                isInvalid={formik.errors.token1MaxPrice ? true : false}
                                                            />
                                                            <Button onClick={() => formik.setFieldValue('token1MaxPrice', formik.values.token1MaxPrice + 1)} isIconOnly radius="full" className="flex-none" size="sm">
                                                                <PlusIcon height={16} width={16} />
                                                            </Button>

                                                        </div>  
                                                    </CardBody>
                                                    <CardFooter className="p-4">
                                                        <div className="text-center w-full text-sm">
                                                            {!finishLoad ? '' : (!reverse
                                                                ? <Fragment> {calcRound(formik.values.token1MaxPrice, 3)} <span className="font-bold">{formik.values.isToken0Sell ? token0Symbol : token1Symbol}</span> per <span className="font-bold">{formik.values.isToken0Sell ? token1Symbol : token0Symbol}</span> </Fragment> 
                                                                : <Fragment> {calcReverse(formik.values.token1MaxPrice, 3)} <span className="font-bold">{formik.values.isToken0Sell ? token1Symbol : token0Symbol}</span> per <span className="font-bold">{formik.values.isToken0Sell ? token0Symbol : token1Symbol}</span> </Fragment>) } 
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                                {
                                                    formik.errors.token1MaxPrice
                                                        ? <div className="text-xs text-danger pt-1 px-1"> {formik.errors.token1MaxPrice}</div>
                                                        : null
                                                }   
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-3">
                                        <Button  onClick={() => setReverse(!reverse)} isIconOnly radius="full" startContent={<ArrowsRightLeftIcon height={24} width={24} />} />    
                                    </div>
                                </div>
                                <Button 
                                    size="lg" type="submit" className="mt-12 w-full font-bold bg-teal-500 text-white"> Add Liquidity </Button>
                            </div>
                        </div>
                    </form>
                </CardBody>
            </Card>
                                
        </div >
    )
}