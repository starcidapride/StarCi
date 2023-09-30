import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
interface SlippageToleranceProps {
    className? : string
}

export const SlippageTolerance = (props: SlippageToleranceProps) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    return <>
        <div className={`flex items-center justify-between ${props.className}`}> 
            <div className="font-bold text-xs" > Slippage Tolerance </div>
            <Button variant="light" size="sm" onPress={onOpen}> <span className="text-sm font-bold text-teal-500"> 1% </span> </Button>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}> 
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                        <ModalBody>
                            <p> 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
                            </p>
                            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nullam pulvinar risus non risus hendrerit venenatis.
                Pellentesque sit amet hendrerit risus, sed porttitor quam.
                            </p>
                            <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}