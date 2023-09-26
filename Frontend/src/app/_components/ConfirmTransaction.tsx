'use client'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { setVisible } from '@redux/slices/confirm-transaction.slice'
import { AppDispatch, RootState } from '@redux/store'
import { useDispatch, useSelector } from 'react-redux'


export const ConfirmTransaction = () => {   
    const visible = useSelector((state: RootState) => state.confirmTransaction.visible)
    const transactionType = useSelector((state: RootState) => state.confirmTransaction.transactionType)
    const dispatch : AppDispatch = useDispatch()

    const onOpenChange = () => {
        dispatch(setVisible(!visible))
    }

    return (
        <Modal 
            hideCloseButton = {true}
            size={'xs'} 
            isOpen={visible} 
            onOpenChange={onOpenChange}
            placement="top-center"
            isDismissable = {false}
            isKeyboardDismissDisabled = {true}
        >
            <ModalContent>
                <ModalBody className="p-5">
                    <div className = "text-teal-500 text-sm font-bold text-center">
                  Confirm {transactionType.toString()}
                    </div>
                    <div className="mt-4">
                        <div className="text-xs text-center"> Process in your wallet</div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
