import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextUIProviders from './nextui.provider'
import { NavigationBar } from '@app/_components'
import ReduxProviders from '@redux/redux.provider'
import { ConfirmTransaction } from './_components/ConfirmTransaction'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

const RootLayout = ({
    children,
}: {
  children: React.ReactNode
}) => (
    <html lang="en" className="light text-foreground bg-background">
        <body className={inter.className}>
            <NextUIProviders>
                <ReduxProviders>
                    <NavigationBar />
                    <ConfirmTransaction />
                    {children}
                </ReduxProviders>
            </NextUIProviders>
        </body>
    </html>
)

export default RootLayout
