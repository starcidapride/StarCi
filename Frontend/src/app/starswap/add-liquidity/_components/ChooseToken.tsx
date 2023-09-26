'use client'
import React, { Fragment, useEffect, useState } from 'react'

import {Modal, ModalContent, ModalHeader, ModalBody, Image, Button, useDisclosure, Divider, Input, Spinner, Card, CardBody, CardFooter, ModalFooter, Link} from '@nextui-org/react'
import { ChainName, chainInfos } from '@utils/constant.utils'
import { getName, getSymbol, isErc20 } from '@web3/contracts/erc20'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Address } from 'web3'
import { throws } from 'assert'

interface ChooseTokenProps{
    chainName: ChainName
    className?: string,
    tokenAddress?: Address,
    otherTokenAddress?: Address,
    handleSubmit: (values: {
        tokenAddress: string
    }) => void
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

    }, [])

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure()

    const [tempTokenSymbol, setTempTokenSymbol] = useState<string|null>(null)

    const [tokenSymbol, setTokenSymbol] = useState<string|null>(null)
    
    const formik = useFormik({
        initialValues: {
            tokenAddress: ''
        },

        validationSchema: Yup.object({
            tokenAddress: Yup.string()
                .test('is-erc20-address',
                    'Input does not represent a valid token contract address',
                    async (value) => isErc20(props.chainName, value!)
                )
                .test('not-same-as-other-token',
                    'Input must not be the same as other token',
                    async function(value) {
                        return value !== props.otherTokenAddress
                    }
                )
                .required('This field is required')
        }),
        onSubmit : values => {
            onClose()
            setTokenSymbol(tempTokenSymbol)
            props.handleSubmit(values)
        }
    })

    const [finishLoad, setFinishLoad] = useState<boolean>(false)

    type StableCoinProps = {
        address: string
        name: string
        symbol: string
    }

    const [stableCoinProps, setStableCoinProps] = useState<StableCoinProps[] | null>(null)
    
    const stableCoins = chainInfos[props.chainName].stableCoins
    
    const trySetTokenSymbol = async (address: string) => {
        let _tokenSymbol: string | null = null
        try{
            if (address === props.otherTokenAddress) throw new Error
            _tokenSymbol = await getSymbol(props.chainName, address)
        } catch (ex){
            //
        } finally {
            console.log(_tokenSymbol)
            setTempTokenSymbol(_tokenSymbol)
        }
    }
    return (
        <Fragment>
            <Button className={props.className} onPress={() => {
                formik.resetForm()
                setTempTokenSymbol(null)
                onOpen()
            }}> { tokenSymbol ?? 'Select'} </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>     
                <ModalContent>
                    
                    {finishLoad ? 
                        <form onSubmit={formik.handleSubmit}>
                            <ModalHeader className="p-5 font-bold text-base">Select A Token</ModalHeader>
                            <Divider />
                            <ModalBody className="p-5">
                                <div>
                                    <Input label="Token Address" 
                                        id="tokenAddress"
                                        value={formik.values.tokenAddress} 
                                        onChange={
                                            async (event) => {
                                                formik.handleChange(event)

                                                trySetTokenSymbol(event.target.value)
                                            }}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.tokenAddress && formik.errors.tokenAddress ? true : false}
                                        errorMessage={formik.errors.tokenAddress}
                                    />
                                </div>  
                                    
                                <div className="mt-3">
                                    <div className="text-sm font-bold text-teal-500">
                                        Stable Coins
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 mt-3">
                                        {stableCoinProps?.map((coinProps, index) => 
                                            <Card isPressable key={index} className="col-span-1"
                                                onClick={
                                                    () => {
                                                        formik.setFieldValue('tokenAddress', coinProps.address)
                                                        trySetTokenSymbol(coinProps.address)
                                                    }
                                                }
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
                                
                            {(
                                tempTokenSymbol != null
                            ) ?
                                <ModalFooter  className="p-5">
                                    <div className="grid grid-cols-4 gap-10 items-center"> 
                                            
                                        <div className="col-span-1 col-start-2">
                                            <Link isBlock showAnchorIcon href="#" color="foreground" size="lg" className="text-center font-bold">
                                                {tempTokenSymbol}
                                            </Link>  
                                        </div>
                                            
                                        <Button type="submit" size="lg" variant="flat" className="col-span-1 font-bold text-teal-500"> Import </Button>
                                    </div>
                                </ModalFooter>
                                : null }                      
                        </form>
                        : 
                        <Spinner className="py-12" color="default" /> }
                </ModalContent>
            </Modal>
        </Fragment>
    )
}