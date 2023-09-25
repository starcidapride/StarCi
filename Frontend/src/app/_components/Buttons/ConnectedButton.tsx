'use client'
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from '@nextui-org/react'

interface ConnectedButtonProps {
    hex: string
}

export const ConnectedButton = (props : ConnectedButtonProps) => {
    //const web3Slice = useSelector((state: Web3Slice) => state.web3)
    //const dispatch : AppDispatch = useDispatch()
    
    return (<Dropdown>
        <DropdownTrigger>
            <Button 
                variant="bordered" 
            >
                {`${props.hex.slice(0,4)}...${props.hex.slice(-2)}`}
            </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new">New file</DropdownItem>
            <DropdownItem key="copy">Copy link</DropdownItem>
            <DropdownItem key="edit">Edit file</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
            Disconnect
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>)
}