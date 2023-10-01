'use client'
import React, { useEffect } from 'react'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react'
import { Logo } from './Logo'
import { ConnectWalletButton } from './Buttons/ConnectWalletButton'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState, setAccount } from '@redux'
import { ConnectedButton } from './Buttons'
import { ChainInfo } from './ChainInfo'
import { ChainName } from '@utils'

export const NavigationBar = () => {
    const web3 = useSelector((state: RootState) => state.web3.web3)
    const account = useSelector((state: RootState) => state.account.account)
    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (web3 != null) {
            const handleEffect = async () => {
                const account = (await web3.eth.getAccounts())[0]
                dispatch(setAccount(account))
            }
            handleEffect()
        }
    }, [dispatch, web3])

    type MenuItem = {
        id: number,
        title: string
    }
    const menuItems: MenuItem[] = [
        {
            id: 0,
            title: 'Team Settings',
        },
        {
            id: 1,
            title: 'Help & Feedback',
        },
        {
            id: 2,
            title: 'Log Out',
        },
    ]

    return (
        <Navbar disableAnimation isBordered>
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">STARCI</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand>
                    <Logo />
                    <p className="font-bold text-inherit">STARCI</p>
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
                    account
                        ? <div className='flex items-center gap-5'>
                            <ChainInfo chainName={ChainName.KalytnTestnet} />
                            <ConnectedButton hex={account} />
                        </div>
                        : <ConnectWalletButton />


                }

            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item) => (
                    <NavbarMenuItem key={item.id}>
                        <Link
                            className="w-full"
                            color={
                                item.id === 2 ? 'warning' : (item.id === menuItems.length - 1 ? 'danger' : 'foreground')
                            }
                            href="#"
                            size="lg"
                        >
                            {item.title}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    )
}