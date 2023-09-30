'use client'
import { MetamaskIcon } from '../MetamaskIcon'
import { Button } from '@nextui-org/button'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import Web3 from 'web3'
import { setWeb3 } from '@redux/slices/web3.slice'


export const ConnectWalletButton = () => {
    const dispatch : AppDispatch = useDispatch()
    
    const connectWallet = async (): Promise<void> => {
        try {
		    // eslint-disable-next-line no-mixed-spaces-and-tabs
		    if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' })

                const provider = window.ethereum
                const web3 = new Web3(provider)

                dispatch(setWeb3(web3))
            } else {
                console.error('MetaMask is not installed or not available')
            }
        } catch (error) {
		  console.error('Error connecting to MetaMask:', error)
        }
    }
    return (<Button color="default" 
        variant="light" 
        startContent={<MetamaskIcon/>}
        onPress={connectWallet}
    >
        Connect Wallet
    </Button>)
}