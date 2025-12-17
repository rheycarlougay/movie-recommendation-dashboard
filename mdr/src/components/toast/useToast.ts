import { useContext } from 'react'
import { ToastContext } from '@components/toast/ToastContainer'
import type { ToastType } from '@components/toast/Toast'

export const useToast = () => {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within ToastContainer')
  }

  return {
    showToast: (message: string, type: ToastType, duration?: number) => {
      context.showToast(message, type, duration)
    },
    success: (message: string, duration?: number) => {
      context.showToast(message, 'success', duration)
    },
    error: (message: string, duration?: number) => {
      context.showToast(message, 'error', duration)
    },
    warning: (message: string, duration?: number) => {
      context.showToast(message, 'warning', duration)
    },
    info: (message: string, duration?: number) => {
      context.showToast(message, 'info', duration)
    },
  }
}
