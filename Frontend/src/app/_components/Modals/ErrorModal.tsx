'use client'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { AppDispatch, RootState, setError } from '@redux'
import { useDispatch, useSelector } from 'react-redux'

export const ErrorModal = () => {
    const error = useSelector((state: RootState) => state.modal.error)
    const dispatch: AppDispatch = useDispatch()

    return (
        <Modal
            size={'xs'}
            isOpen={error}
            placement="top-center"
            onClose={() => dispatch(setError(false))}
        >
            <ModalContent>
                <ModalBody className="p-5">
                    <div className="text-base font-bold text-red-500 text-center">
            Oops! Something Went Wrong
                    </div>
                    <div className="mt-4">
                        <div className="text-sm text-center">
                            {' '}
              An internet error occurred or an unexpected problem arose. Please
              try again later
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
