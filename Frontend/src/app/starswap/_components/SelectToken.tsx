'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Image,
    Button,
    useDisclosure,
    Divider,
    Input,
    Card,
    CardBody,
    CardFooter,
    ModalFooter,
    Link,
} from '@nextui-org/react'
import { ChainName, TIME_OUT, chainInfos } from '@utils'
import { getName, getSymbol } from '@web3'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Address } from 'web3'
import { StableCoinSkeleton } from './StableCoinSkeleton'
import { useSelector } from 'react-redux'
import { RootState } from '@redux'
import { FetchSpinner } from '@app/_components/Commons/FetchSpinner'

interface SelectTokenProps {
  chainName: ChainName;
  className?: string;
  tokenAddress?: Address;
  otherTokenAddress?: Address;
  handleSubmit: (values: { tokenAddress: string }) => void;
}

export const SelectToken = (props: SelectTokenProps) => {
    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName,
    )
    useEffect(() => {
        const _stableCoinProps: StableCoinProps[] = []

        const handleEffect = async () => {
            console.log(stableCoins)

            for (const coin of stableCoins) {
                const _name = await getName(props.chainName, coin)
                if (_name == null) return

                const _symbol = await getSymbol(props.chainName, coin)
                if (_symbol == null) return

                _stableCoinProps.push({
                    address: coin,
                    name: _name,
                    symbol: _symbol,
                })
            }

            setStableCoinProps(_stableCoinProps)
            setFinishLoad(true)
        }
        handleEffect()
    }, [])

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const [tempTokenSymbol, setTempTokenSymbol] = useState('')

    const [tokenSymbol, setTokenSymbol] = useState('')

    const formik = useFormik({
        initialValues: {
            tokenAddress: '',
        },

        validationSchema: Yup.object({
            tokenAddress: Yup.string().required('This field is required'),
        }),
        onSubmit: (values) => {
            onClose()
            setTokenSymbol(tempTokenSymbol)
            props.handleSubmit(values)
        },
    })

    const [syncToken, setSyncToken] = useState(false)

    const firstLoad = useRef(true)

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false
            return
        }

        const controller = new AbortController()
        const handleEffect = async () => {
            setSyncToken(true)
            const symbol = await getSymbol(
                chainName,
                formik.values.tokenAddress,
                controller,
            )

            setTempTokenSymbol(symbol ? symbol : '')

            setSyncToken(false)
        }
        const delayDebounceFn = setTimeout(() => handleEffect(), TIME_OUT)

        return () => {
            controller.abort()
            clearTimeout(delayDebounceFn)
        }
    }, [formik.values.tokenAddress])

    const [finishLoad, setFinishLoad] = useState<boolean>(false)

  type StableCoinProps = {
    address: string;
    name: string;
    symbol: string;
  };

  const [stableCoinProps, setStableCoinProps] = useState<
    StableCoinProps[] | null
  >(null)

  const stableCoins = chainInfos[props.chainName].stableCoins

  const getIsValidated = () => {
      if (formik.errors.tokenAddress) return true
      if (syncToken) return false
      if (tempTokenSymbol == '' && formik.values.tokenAddress) return true
      if (
          tempTokenSymbol &&
      formik.values.tokenAddress == props.otherTokenAddress
      )
          return true
      return false
  }

  const getErrorMessage = () => {
      if (formik.errors.tokenAddress) return formik.errors.tokenAddress

      if (syncToken) return undefined
      if (tempTokenSymbol == '' && formik.values.tokenAddress)
          return 'Input does not represent a valid token address'
      if (
          tempTokenSymbol &&
      formik.values.tokenAddress == props.otherTokenAddress
      )
          return 'Token address pair cannot be the same'
      return undefined
  }

  return (
      <Fragment>
          <Button
              className={props.className}
              onPress={() => {
                  formik.resetForm()
                  setTempTokenSymbol('')
                  onOpen()
              }}
              variant="flat"
          >
              {' '}
              {tokenSymbol ? tokenSymbol : 'Select'}{' '}
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
              <ModalContent>
                  <form onSubmit={formik.handleSubmit}>
                      <ModalHeader className="p-5 font-bold text-base">
              Select Token
                      </ModalHeader>
                      <Divider />
                      <ModalBody className="p-5">
                          <div>
                              <Input
                                  label="Token Address"
                                  id="tokenAddress"
                                  value={formik.values.tokenAddress}
                                  onChange={(event) => {
                                      formik.handleChange(event)
                                      setSyncToken(true)
                                  }}
                                  description={
                                      <FetchSpinner message="Checking" finishFetch={syncToken} />
                                  }
                                  onBlur={formik.handleBlur}
                                  isInvalid={getIsValidated()}
                                  errorMessage={getErrorMessage()}
                              />
                          </div>

                          <div className="mt-3">
                              <div className="text-sm font-bold text-teal-500">
                  Stable Coins
                              </div>
                              <div className="grid grid-cols-4 gap-4 mt-3">
                                  {finishLoad
                                      ? stableCoinProps?.map((coinProps) => (
                                          <Card
                                              isPressable
                                              key={coinProps.address}
                                              className="col-span-1"
                                              onClick={() => {
                                                  formik.setFieldValue(
                                                      'tokenAddress',
                                                      coinProps.address,
                                                  )
                                                  if (
                                                      formik.values.tokenAddress != coinProps.address
                                                  ) {
                                                      setSyncToken(true)
                                                  }
                                              }}
                                          >
                                              <CardBody>
                                                  <Image
                                                      src="/icons/stable-coins/USDT.svg"
                                                      className="w-12 h-12"
                                                      radius="full"
                                                      alt="ss"
                                                  />
                                              </CardBody>
                                              <CardFooter>
                                                  <div className="text-small w-full font-bold text-center">
                                                      {' '}
                                                      {coinProps.symbol}
                                                  </div>
                                              </CardFooter>
                                          </Card>
                                      ))
                                      : [0, 1].map((key) => <StableCoinSkeleton key={key} />)}
                              </div>
                          </div>
                      </ModalBody>
                      <ModalFooter className="p-5">
                          {tempTokenSymbol &&
              !syncToken &&
              formik.values.tokenAddress != props.otherTokenAddress ? (
                                  <div className="grid grid-cols-4 gap-10 items-center">
                                      <div className="col-span-1 col-start-2">
                                          <Link
                                              isBlock
                                              showAnchorIcon
                                              href="#"
                                              color="foreground"
                                              size="lg"
                                              className="text-center font-bold"
                                          >
                                              {tempTokenSymbol}
                                          </Link>
                                      </div>

                                      <Button
                                          type="submit"
                                          size="lg"
                                          variant="flat"
                                          className="col-span-1 font-bold text-teal-500"
                                      >
                                          {' '}
                    Import{' '}
                                      </Button>
                                  </div>
                              ) : null}
                      </ModalFooter>
                  </form>
              </ModalContent>
          </Modal>
      </Fragment>
  )
}
