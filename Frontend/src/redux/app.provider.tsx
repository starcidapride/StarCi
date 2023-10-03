'use client'
    
import { TokenData } from '@api'
import { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './store'
import { setTokenData } from '@redux'

interface AppProvidersProps{
    data: TokenData[]
}
export const AppProviders = (props: AppProvidersProps) => {
    const dispatch: AppDispatch = useDispatch()
    dispatch(setTokenData(props.data))

    return (<Fragment> </Fragment>)
}