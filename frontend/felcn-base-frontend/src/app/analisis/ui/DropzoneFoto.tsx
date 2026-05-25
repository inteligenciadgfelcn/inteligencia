'use client'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface DropzoneFotoProps {
  label: string
  archivo: File | null
  onChange: (file: File | null) => void
  accept?: string
  error?: boolean
  descripcionTipo?: string
}

export function DropzoneFoto({
  label,
  archivo,
  onChange,
  accept = 'image/*',
  error = false,
  descripcionTipo = 'PNG, JPG, WEBP',
}: DropzoneFotoProps) {
  const [arrastrar, setArrastrar] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setArrastrar(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onChange(file)
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
          arrastrar
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : error
              ? 'border-danger bg-red-50 dark:bg-red-900/10'
              : 'border-[#e0e6ed] hover:border-green-400 dark:border-[#1b2e4b] dark:hover:border-green-600'
        }`}
        onDragOver={(e) => { e.preventDefault(); setArrastrar(true) }}
        onDragEnter={() => setArrastrar(true)}
        onDragLeave={() => setArrastrar(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {archivo ? (
          <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <span className="truncate text-xs text-gray-600 dark:text-gray-400">{archivo.name}</span>
            <Button
              type="button"
              variant="danger"
              size="sm"
              className="ml-2 p-1"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = ''
                onChange(null)
              }}
            >
              ✕
            </Button>
          </div>
        ) : (
          <>
            <svg className="mx-auto mb-2 h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-xs">
              <span className="font-medium text-green-600">Sube un archivo</span>
              <span className="text-gray-500"> o arrastra y suelta</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">{descripcionTipo}</p>
          </>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-danger italic">Este campo es obligatorio</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
