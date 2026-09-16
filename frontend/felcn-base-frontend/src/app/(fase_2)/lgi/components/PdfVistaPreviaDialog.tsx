'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  obtenerBlob: () => Promise<Blob>
  nombreDescarga?: string
}

export function PdfVistaPreviaDialog({
  isOpen,
  onClose,
  title,
  obtenerBlob,
  nombreDescarga,
}: Props) {
  const obtenerBlobRef = useRef(obtenerBlob)
  obtenerBlobRef.current = obtenerBlob

  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let activo = true
    setCargando(true)
    setError('')
    setBlob(null)
    setUrl('')
    obtenerBlobRef
      .current()
      .then((datos) => {
        if (!activo) return
        setBlob(datos)
        setUrl(URL.createObjectURL(datos))
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el reporte.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  if (!isOpen) return null

  const descargar = () => {
    if (!blob || !nombreDescarga) return
    const objectUrl = URL.createObjectURL(blob)
    const enlace = document.createElement('a')
    enlace.href = objectUrl
    enlace.download = nombreDescarga
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    URL.revokeObjectURL(objectUrl)
  }

  const cerrar = () => {
    if (url) URL.revokeObjectURL(url)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl dark:bg-[#0f172a]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
          <h3 className="text-lg font-bold text-dark dark:text-white-light">
            {title}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={cerrar}
          >
            ✕
          </button>
        </div>
        <div className="flex h-[70vh] items-center justify-center p-5">
          {cargando && <p className="text-sm text-gray-500">Cargando reporte...</p>}
          {error && !cargando && <p className="text-sm text-danger">{error}</p>}
          {url && !cargando && (
            <iframe title={title} src={url} className="h-full w-full rounded-lg" />
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 dark:border-[#1b2e4b]">
          {nombreDescarga && blob && (
            <Button
              type="button"
              variant="outline-primary"
              disabled={cargando && !blob}
              onClick={descargar}
            >
              Descargar
            </Button>
          )}
          <Button type="button" variant="outline-secondary" onClick={cerrar}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}