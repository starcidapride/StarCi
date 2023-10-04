import { createSlice } from '@reduxjs/toolkit'
import { TokenData } from '../../utils/api'

export interface TokenDataSlice {
    tokenData: TokenData[]
}

const initialState : TokenDataSlice = {
    tokenData: []
}

export const tokenDataSlice = createSlice({
    name: 'tokenData',
    initialState,
    reducers: {
        setTokenData(state, action) {
            state.tokenData = action.payload
        }
    }
})

export const { setTokenData } = tokenDataSlice.actions

export default tokenDataSlice.reducer

