import { createSlice } from '@reduxjs/toolkit'
import Web3 from 'web3'

export interface Web3Slice {
    web3: Web3|null
}

const initialState: Web3Slice = {
    web3 : null
}

export const web3Slice = createSlice({
    name: 'web3',
    initialState,
    reducers: {
        setWeb3(state, action) {
            state.web3 = action.payload
        },
    }
})

export const { setWeb3 } = web3Slice.actions

export default web3Slice.reducer

