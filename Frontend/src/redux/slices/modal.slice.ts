import { createSlice } from '@reduxjs/toolkit'

export interface ModalSlice {
    connectMetamask: boolean
    confirmTransaction: {
        title: string
        show: boolean
        content: string
    }
    error: boolean
}

const initialState: ModalSlice = {
    connectMetamask: false,
    confirmTransaction: {
        title: '',
        content: '',
        show: false,
    },
    error: false
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setConnectMetamask(state, action) {
            state.connectMetamask = action.payload
        },
        setConfirmTransactionData(state, action) {
            state.confirmTransaction.title = action.payload.title
            state.confirmTransaction.content = action.payload.content
        },
        setShowConfirmTransaction(state, action) {
            state.confirmTransaction.show = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        }
    },
})

export const {
    setConnectMetamask,
    setConfirmTransactionData,
    setShowConfirmTransaction,
    setError
} = modalSlice.actions

export default modalSlice.reducer
