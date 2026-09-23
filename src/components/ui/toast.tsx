"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

function notifyListeners() {
  listeners.forEach(l => l([...toasts]))
}

export function toast(message: string, type: ToastType = 'info') {
  const id = Date.now().toString()
  toasts.push({ id, type, message })
  notifyListeners()
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }, 4000)
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-[360px]">
      {currentToasts.map(t => (
        <div key={t.id} className={`flex items-start gap-2 p-3 rounded-[12px] shadow-lg border backdrop-blur text-sm ${
          t.type === 'success' ? 'bg-[#D1FAE5] border-[#86EFAC] text-[#065F46]' :
          t.type === 'error' ? 'bg-[#FFE4E6] border-[#FFA2A2] text-[#9F1239]' :
          'bg-white border-[#E8E0D0] text-[#1A2E1A]'
        }`}>
          {t.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" /> :
           t.type === 'error' ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> :
           <Info className="h-4 w-4 shrink-0 mt-0.5" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => {
            toasts = toasts.filter(x => x.id !== t.id)
            notifyListeners()
          }}><X className="h-4 w-4 opacity-60" /></button>
        </div>
      ))}
    </div>
  )
}
