'use client'
    
import { Provider } from 'react-redux'
import store from './store'

const ReduxProviders = ({ children } : {
    children: React.ReactNode
  }) => (
    <Provider store={store}>
        {children}
    </Provider>
)

export default ReduxProviders