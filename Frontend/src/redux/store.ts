import { configureStore } from '@reduxjs/toolkit'
import blockchainReducer, { blockchainSlice } from './slices/blockchain.slice'
import modalReducer, { modalSlice } from './slices/modal.slice'
import toastReducer, { toastSlice } from './slices/toast.slice'


const store = configureStore({
    reducer: {
        [blockchainSlice.name]: blockchainReducer,
        [modalSlice.name]: modalReducer,
        [toastSlice.name]: toastReducer
    },
    devTools: false
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store