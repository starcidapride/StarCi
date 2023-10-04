'use client'
import { NextUIProvider } from '@nextui-org/react'

const NextUIProviders = ({children}: { children: React.ReactNode }) => {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}

export default NextUIProviders