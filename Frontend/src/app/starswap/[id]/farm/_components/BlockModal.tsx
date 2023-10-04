'use client'
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { AppDispatch, RootState, setVisible } from '@redux'
import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { PoolAddressContext } from '../../layout'
import {join} from '@web3'

export const BlockModal = () => {   

    const [visible, setVisible] = useState(true)
    const router = useRouter()
    
    const account = useSelector((state: RootState) => state.account.account)
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const poolAddress = useContext(PoolAddressContext)

    return (
        <Modal 
            hideCloseButton = {true}
            size={'xs'} 
            isOpen={visible} 
            placement="top-center"
            isDismissable = {false}
            isKeyboardDismissDisabled = {true}
        >
            <ModalContent>
                <ModalBody className="p-5">
                    <div className = "text-teal-500 text-sm font-bold text-center">
                    Notification
                    </div>
                    <div className="mt-6">
                        <div className="text-sm text-center">  To start farming, please join first</div>
                    </div>
                    <div className = "flex gap-5 mt-6">
                        <Button
                            onPress={() => router.push(`/starswap/${poolAddress}`)}
                            size="lg" type="submit" variant = "bordered" className="w-full font-bold border-teal-500"> Quit
                        </Button>
                        <Button
                            onPress={async () => 
                            {
                                if (web3 == null) return
                                await join(
                                    web3,
                                    account,
                                    poolAddress
                                )
                            }
                            }
                            size="lg" type="submit" className="w-full font-bold bg-teal-500 text-white"> Join
                        </Button> 
                    </div>
    
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
