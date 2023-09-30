import { createSlice } from '@reduxjs/toolkit'
import { ChainName } from '@utils'

export interface ChainNameSlice {
    chainName: ChainName
}

const initialState : ChainNameSlice = {
    chainName: ChainName.KalytnTestnet
}

export const chainNameSlice = createSlice({
    name: 'chainName',
    initialState,
    reducers: {
        setChainName(state, action) {
            state.chainName = action.payload
        }
    }
})

export const { setChainName } = chainNameSlice.actions

export default chainNameSlice.reducer

