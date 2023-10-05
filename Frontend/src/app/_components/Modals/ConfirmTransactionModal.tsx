'use client'
import {
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
} from '@nextui-org/react'
import { RootState } from '@redux'
import { useSelector } from 'react-redux'

export const ConfirmTransaction = () => {
    const confirmTransaction = useSelector(
        (state: RootState) => state.modal.confirmTransaction,
    )

    return (
        <Modal
            hideCloseButton={true}
            size={'sm'}
            isOpen={confirmTransaction.show}
            placement="top-center"
            isDismissable={confirmTransaction.show}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>

                <ModalBody className="p-5">
                    <div className="font-bold text-center w-full text-base">
                        {' '}
            Confirm {confirmTransaction.title}
                    </div>
                    <div className="text-sm text-center">
                        {' '}
                        {confirmTransaction.content}
                    </div>
                </ModalBody>
                <Divider />
                <ModalFooter>
                    <div className="text-xs w-full text-center text-teal-500">
                        {' '}
            Process in your wallet{' '}
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
