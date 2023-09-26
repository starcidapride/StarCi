import { createSlice } from '@reduxjs/toolkit'

export enum TransactionType {
    Swap = 'Swap'
}

export interface ConfirmTransactionSlice {
    visible: boolean,
    transactionType: TransactionType
}

const initialState : ConfirmTransactionSlice = {
    visible: false,
    transactionType: TransactionType.Swap
}

export const confirmTransactionSlice = createSlice({
    name: 'confirmTransaction',
    initialState,
    reducers: {
        setVisible(state, action) {
            state.visible = action.payload
        },
        setTransactionType(state, action) {
            state.transactionType = action.payload
        },
    }
})

export const { setVisible, setTransactionType } = confirmTransactionSlice.actions

export default confirmTransactionSlice.reducer

