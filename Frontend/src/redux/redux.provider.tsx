'use client'

import { Provider } from 'react-redux'
import store from './store'
import { NextUIProvider } from '@nextui-org/react'
import { ReactNode } from 'react'

export const ReduxProviders = ({ children }: { children: ReactNode}) => { 
    return (
        <Provider store={store}>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </Provider>
    )
}