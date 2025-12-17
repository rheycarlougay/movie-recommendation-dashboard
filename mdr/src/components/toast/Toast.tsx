import { useEffect } from 'react'
import '@css/Toast.css'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  message: string
  type: ToastType
  onClose: (id: string) => void
  duration?: number
}

function Toast({ id, message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  return (
    <div className={`toast toast-${type}`} onClick={() => onClose(id)}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon(type)}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={(e) => { e.stopPropagation(); onClose(id) }} aria-label="Close">
          ×
        </button>
      </div>
    </div>
  )
}

function getIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    default:
      return 'ℹ'
  }
}

export default Toast
