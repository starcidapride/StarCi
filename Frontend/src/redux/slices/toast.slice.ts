import { createSlice } from '@reduxjs/toolkit'


export interface ToastSlice {
    txHash: string,
    showToast: boolean 
}

const initialState : ToastSlice = {
    txHash: '',
    showToast: false
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        setToastTxHash(state, action){
            state.txHash = action.payload
        },
        setShowToast(state, action){
            state.showToast = action.payload
        }
    }
})

export const { setToastTxHash, setShowToast } = toastSlice.actions

export default toastSlice.reducer

