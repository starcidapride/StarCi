'use client'
import React, { useEffect } from 'react'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuItem, NavbarMenuToggle} from '@nextui-org/react'
import { Logo } from './Logo'
import { ConnectWalletButton } from './Buttons/ConnectWalletButton'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { setAccount } from '@redux/slices/account.slice'
import { ConnectedButton } from './Buttons'
import { ChainInfo } from './ChainInfo'
import { ChainName } from '@utils/constant.utils'

export const NavigationBar = () => {
    const web3Slice = useSelector((state: RootState) => state.web3)
    const accountSlice = useSelector((state: RootState) => state.account)
    const dispatch : AppDispatch = useDispatch()

    useEffect(() => {
        const web3 = web3Slice.web3
        if (web3 != null){
            const handleEffect = async () => {
                const account = (await web3.eth.getAccounts())[0]
                dispatch(setAccount(account))
            }
            handleEffect()
        }
    }, [dispatch, web3Slice])

    const menuItems = [ 
        'Profile',
        'Dashboard',
        'Activity',
        'Analytics',
        'System',
        'Deployments',
        'My Settings',
        'Team Settings',
        'Help & Feedback',
        'Log Out',
    ]

    return (
        <Navbar disableAnimation isBordered>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Features
                    </Link>
                </NavbarItem>
                <NavbarItem isActive>
                    <Link href="#" aria-current="page" color="warning">
            Customers
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
            Integrations
                    </Link>
                </NavbarItem>
            </NavbarContent>
                
            <NavbarContent justify="end">
                {
                    accountSlice.account == null 
                        ? <ConnectWalletButton />
                        : 
                        <div className='flex items-center gap-5'>
                            <ChainInfo chainName={ChainName.KalytnTestnet}/> 
                            <ConnectedButton hex={accountSlice.account}/>
                        </div>
                }
                
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? 'warning' : index === menuItems.length - 1 ? 'danger' : 'foreground'
                            }
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}