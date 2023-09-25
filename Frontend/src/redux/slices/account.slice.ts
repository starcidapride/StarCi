import { createSlice } from '@reduxjs/toolkit'

export interface AccountSlice {
    account: string | null
}

const initialState : AccountSlice = {
    account: null
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccount(state, action) {
            state.account = action.payload
        }
    }
})

export const { setAccount } = accountSlice.actions

export default accountSlice.reducer

