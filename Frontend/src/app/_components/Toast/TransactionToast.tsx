'use client'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { AppDispatch, RootState, setShowToast } from '@redux'
import { useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './style.css'
import { ScopeReference } from '../Commons/ScopeReference'

export const TransactionToast = () => {
    const txHash = useSelector((state: RootState) => state.toast.txHash)
    const showToast = useSelector((state: RootState) => state.toast.showToast)
    const dispatch: AppDispatch = useDispatch()

    const ToastBody = () => (
        <div>
            <div className="text-teal-500 font-bold text-sm">
        Transaction Receipt
            </div>
            <div className="text-sm">
                <span> View on Explorer: </span>{' '}
                <ScopeReference hash={txHash} isTransaction />
            </div>
        </div>
    )

    useEffect(() => {
        if (showToast) {
            toast(ToastBody, {
                className: 'rounded-large shadow-medium',
            })
            dispatch(setShowToast(false))
        }
    }, [showToast])

    return (
        <ToastContainer
            position="top-right"
            autoClose={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            theme="light"
        />
    )
}
