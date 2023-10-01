'use client'
import { NextUIProvider } from '@nextui-org/react'
import ReduxProviders from '@redux'

const NextUIProviders = ({children}: { children: React.ReactNode }) => {
    return (
        <NextUIProvider>
            <ReduxProviders>
                {children}
            </ReduxProviders>
        </NextUIProvider>
    )
}

export default NextUIProviders