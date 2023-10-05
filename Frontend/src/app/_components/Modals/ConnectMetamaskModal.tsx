'use client'
import { Button, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { RootState } from '@redux'
import { useSelector } from 'react-redux'

export const ConnectMetamask = () => {
    const connectMetamask = useSelector(
        (state: RootState) => state.modal.connectMetamask,
    )

    return (
        <Modal
            hideCloseButton={true}
            size={'xs'}
            isOpen={connectMetamask}
            placement="top-center"
            isDismissable={false}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>
                <ModalBody className="p-5">
                    <div className="text-teal-500 text-sm font-bold text-center">
            Connect Wallet
                    </div>
                    <div className="mt-4">
                        <div className="text-xs text-center">
                            {' '}
              Please connect your Metamask &apos s wallet first{' '}
                        </div>
                    </div>
                    <Button
                        onPress={async () => {}}
                        size="lg"
                        type="submit"
                        className="w-full font-bold bg-teal-500 text-white"
                    >
                        {' '}
            Connect Wallet
                    </Button>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
