'use client'
import React, { Fragment, useEffect, useState } from 'react'

import {Modal, ModalContent, ModalHeader, ModalBody, Image, Button, useDisclosure, Divider, Input, Spinner, Card, CardBody, CardFooter, ModalFooter} from '@nextui-org/react'
import { ChainName, chainInfos } from '@utils/constant.utils'
import { getName, getSymbol } from '@web3/contracts/erc20'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { HashtagIcon, MinusIcon } from '@heroicons/react/24/outline'

interface ChooseTokenProps{
    chainName: ChainName
    className? : string,
}

export const ChooseToken = (props: ChooseTokenProps) => {
    
    useEffect(() => {
        console.log('called')
        const _stableCoinProps: StableCoinProps[] = []
        
        const handleEffect = async () => {
            console.log(stableCoins)
            for (const coin of stableCoins){
                const _name = await getName(props.chainName, coin)
                const _symbol = await getSymbol(props.chainName, coin)
                console.log(_name)  
                _stableCoinProps.push({
                    address: coin,
                    name: _name,
                    symbol: _symbol
                })
            }
            setStableCoinProps(_stableCoinProps)
            setFinishLoad(true)
        }
        handleEffect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure()

    const [tokenSymbol, setTokenSymbol] = useState<string|null>(null)
    
    const formik = useFormik({
        initialValues: {
            tokenAddress: ''
        },

        validationSchema: Yup.object({
            tokenAddress: Yup.string()
                .test('is-erc20-address',
                    () => 'Input does not represent a valid token contract address',
                    async (value) => {             
                        try{
                            await getName(props.chainName, value!)
                            
                            const _tokenSymbol = await getSymbol(props.chainName, value!)
                            setTokenSymbol(_tokenSymbol)

                            return true
                        } catch(ex){
                            setTokenSymbol(null)
                            return false
                        }
    
                    }
                )
                .required('This field is required')
        }),
        onSubmit : values => {onClose()}
    })

    const [finishLoad, setFinishLoad] = useState<boolean>(false)

    type StableCoinProps = {
        address: string
        name: string
        symbol: string
    }

    const [stableCoinProps, setStableCoinProps] = useState<StableCoinProps[] | null>(null)
    
    const stableCoins = chainInfos[props.chainName].stableCoins
    
    return (
        <Fragment>
            <Button className={props.className} onPress={() => {
                formik.resetForm()
                setTokenSymbol(null)
                onOpen()
            }}>Open Modal</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>     
                <ModalContent>
                    
                    {finishLoad ? (onClose) => (
                        <>
                            <form onSubmit={formik.handleSubmit}>
                                <ModalHeader className="p-5 font-bold text-base">Select A Token</ModalHeader>
                                <Divider />
                                <ModalBody className="p-5">
                                    <div>
                                        <Input label="Token Address" 
                                            id="tokenAddress"
                                            value={formik.values.tokenAddress} 
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            onReset={formik.handleReset}
                                            isInvalid={formik.touched.tokenAddress && formik.errors.tokenAddress ? true : false}
                                            errorMessage={formik.errors.tokenAddress}
                                        />
                                        {(
                                            tokenSymbol != null &&
                                            !(formik.touched.tokenAddress && formik.errors.tokenAddress)
                                        ) ?
                                            <div className="text-xs mt-1"> 
                                            Current: <span className="font-bold"> {tokenSymbol} </span>
                                            </div> 
                                            : null }  
                                    </div>  
                                    
                                    <div className="mt-3">
                                        <div className="text-sm font-bold text-teal-500">
                                        Stable Coins
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mt-3">
                                            {stableCoinProps?.map((coinProps, index) => 
                                                <Card isPressable key={index} className="col-span-1"
                                                    onClick={() => formik.setFieldValue('tokenAddress', coinProps.address)}
                                                > 
                                                    <CardBody>
                                                        <Image src="/icons/stable-coins/USDT.svg" width={120} height={120} radius="full" alt="ss"/>
                                                    </CardBody>
                                                    <CardFooter>
                                                        <div className="text-small w-full font-bold text-center"> {coinProps.symbol}</div>
                                                    </CardFooter>
                                                </Card>
                                            )}
                                        </div>
                                    </div>
                                </ModalBody>
                            
                                <ModalFooter>
                                    <Button type="submit" size="lg" variant="flat" className="mt-12 w-full font-bold text-teal-500"> Select </Button>
                                </ModalFooter>
                            </form>
                        </>
                    ) : 
                        <Spinner className="py-12" color="default" /> }
                </ModalContent>
            </Modal>
        </Fragment>
    )
}