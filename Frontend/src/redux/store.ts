import { configureStore } from '@reduxjs/toolkit'
import web3Reducer, { web3Slice } from './slices/web3.slice'
import accountReducer, { accountSlice } from './slices/account.slice'
import confirmTransactionReducer, { confirmTransactionSlice } from './slices/confirm-transaction.slice'

const store = configureStore({
    reducer: {
        [web3Slice.name]: web3Reducer,
        [accountSlice.name]: accountReducer,
        [confirmTransactionSlice.name]: confirmTransactionReducer
    },
    devTools: false
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store