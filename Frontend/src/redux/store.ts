import { configureStore } from '@reduxjs/toolkit'
import web3Reducer, { web3Slice } from './slices/web3.slice'
import accountReducer, { accountSlice } from './slices/account.slice'
import confirmTransactionReducer, { confirmTransactionSlice } from './slices/confirm-transaction.slice'
import chainNameReducer, {chainNameSlice} from './slices/chain-name.slice'
import tokenDataReducer, {tokenDataSlice} from './slices/token-data.slice'

const store = configureStore({
    reducer: {
        [web3Slice.name]: web3Reducer,
        [accountSlice.name]: accountReducer,
        [confirmTransactionSlice.name]: confirmTransactionReducer,
        [chainNameSlice.name]: chainNameReducer,
        [tokenDataSlice.name]: tokenDataReducer,
    },
    devTools: false
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store