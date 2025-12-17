import React, { useState, useCallback } from 'react'
import Toast from '@components/toast/Toast'
import type { ToastType } from '@components/toast/Toast'
import '@css/Toast.css'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void
}

export const ToastContext = React.createContext<ToastContextType | null>(null)

function ToastContainer({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastContainer
