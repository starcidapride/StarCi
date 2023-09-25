'use client'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import { ChooseToken } from './ChooseToken'
import { ArrowsRightLeftIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Web3 from 'web3'
import { getSymbol } from '@web3/contracts/erc20/erc20.contract'
import { ChainName } from '@utils/constant.utils'

export const AddLiquidity = () => {
    
    const handleIsErc20Address = async (value: string | undefined) => {
        try
        {   
            const _value = Web3.utils.toChecksumAddress(value!)
            const symbol = await getSymbol(ChainName.KalytnTestnet, _value)
            console.log(symbol)
            return true
        } catch(ex){
            console.log(ex)
            return false
        }
    }
    // const formik = useFormik({
    //     initialValues: {
    //         token0: '',
    //         token1: '',
    //         isToken0Sell: true,
    //         token0MaxAmount: 0,
    //         token1MaxAmount: 0,
    //         token1MinPrice: 0,
    //         token1MaxPrice: 0,
    //         protocolFee: 0
    //     },

    //     validationSchema: Yup.object({
    //         token0: Yup.string()
    //             .test('is-erc20-address',
    //                 () => 'Input does not represent a valid token contract address',
    //                 value => handleIsErc20Address(value)
    //             )
    //             .required('This field is required'),
    //         token1: Yup.string()
    //             .test('is-erc20-address',
    //                 () => 'Input does not represent a valid token contract address',
    //                 value => handleIsErc20Address(value)
    //             )
    //             .required('This field is required'),
    //         token0MaxAmount: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
    //         token1MaxAmount: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
    //         token1MinPrice: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
    //         token1MaxPrice: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
    //         protocolFee: Yup.number().min(0, 'Input must be greater than or equal to 0').required('This field is required'),
    //     }),

    //     onSubmit: values => {
    //         console.log(values)

    //         const handleSubmit = async () => {
    //         }
    //         handleSubmit()
    //     }
    // })

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

    const tokens = [{ label: 'STARCI', value: 'starci' }, { label: 'ETH', value: 'etherum' }]
    return (
        <div>
            <Card>
                <CardHeader className='font-bold p-5'> Add Liquidity </CardHeader>
                <Divider />
                <CardBody>
                    <div className="grid grid-cols-2 gap-12">
                        <div className="sm:col-span-1 col-span-2">
                            <div>
                                <div className="text-sm font-bold text-teal-500"> Choose Token Pair </div>
                                <div className="flex items-center gap-4 mt-6">
                                    <ChooseToken chainName={ChainName.KalytnTestnet} className="grow" />
                                    <PlusIcon height={24} width={24} />
                                    <ChooseToken chainName={ChainName.KalytnTestnet} className="grow" />
                                </div>

                            </div>
                            <div className="mt-12">
                                <div className="text-sm font-bold text-teal-500"> Pick Protocol Fee Tier </div>
                                <div className="flex items-center gap-4 mt-6">
                                    {protocolFees.map((fee, index) =>
                                        (<Card key={index} className="flex-1" isPressable>
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
                                    items={tokens}
                                    label="Sell Token"
                                    className="col-span-2 mt-6"
                                >
                                    {(token) => <SelectItem key={token.value}>{token.label}</SelectItem>}
                                </Select>

                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <div className="text-xs text-end col-span-1"> Balance : 0</div>
                                        <Input
                                            type="number"
                                            className="mt-1"
                                            label="ETH"
                                            variant="bordered"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-xs text-end col-span-1"> Balance : 0</div>
                                        <Input
                                            type="number"
                                            className="mt-1"
                                            label="Cake "
                                            variant="bordered"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-1 col-span-2 h-full justify-between flex flex-col">
                            <div>
                                <div className="text-sm font-bold text-teal-500"> Set Price Range </div>
                                <div className="mt-6">
                                    
                                    <div className="flex items-center gap-4 mt-4">
                                        <Card className="flex-1">
                                            <CardHeader className="p-5">
                                                <div className="font-bold text-center w-full text-sm">
                                                Min Price
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="items-center flex gap-4">
                                                    <Button isIconOnly radius="full" className="flex-none" size="sm">
                                                        <MinusIcon height={16} width={16} />
                                                    </Button>
                                                    <Input
                                                        className="flex-1"
                                                        type="number"
                                                        variant="flat"
                                                        classNames={{
                                                            'input': 'text-center'
                                                        }}
                                                    />
                                                    <Button isIconOnly radius="full" className="flex-none" size="sm">
                                                        <PlusIcon height={16} width={16} />
                                                    </Button>

                                                </div>
                                            </CardBody>
                                            <CardFooter className="p-4">
                                                <div className="text-center w-full text-sm">
                                                    <span className="font-bold">ETH</span> per <span className="font-bold">WBNB </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                        <Button className="flex-none" isIconOnly radius="full" startContent={<ArrowsRightLeftIcon height={24} width={24} />}/>
                                        <Card className="flex-1">
                                            <CardHeader className="p-5">
                                                <div className="font-bold text-center w-full text-sm">
                                                Max Price
                                                </div>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="items-center flex gap-4">
                                                    <Button isIconOnly radius="full" className="flex-none" size="sm">
                                                        <MinusIcon height={16} width={16} />
                                                    </Button>
                                                    <Input
                                                        className="flex-1"
                                                        type="number"
                                                        variant="flat"
                                                        classNames={{
                                                            'input': 'text-center'
                                                        }}
                                                    />
                                                    <Button isIconOnly radius="full" className="flex-none" size="sm">
                                                        <PlusIcon height={16} width={16} />
                                                    </Button>

                                                </div>
                                            </CardBody>
                                            <CardFooter className="p-4">
                                                <div className="text-center w-full text-sm">
                                                    <span className="font-bold">ETH</span> per <span className="font-bold">WBNB </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </div>                       
                            </div>
                            <Button size="lg" className="mt-12 w-full font-bold bg-teal-500 text-white"> Add Liquidity </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

        </div >
    )
}