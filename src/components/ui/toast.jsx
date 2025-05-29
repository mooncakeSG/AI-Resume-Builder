import { useEffect } from 'react'

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type]

  return (
    <div 
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300`}
      style={{
        maxWidth: '90vw',
        wordBreak: 'break-word'
      }}
    >
      {message}
    </div>
  )
}

export default Toast 