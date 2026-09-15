'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import IconX from '@/components/Icon/IconX'
import { useAlerts } from '@/hooks'
import { imprimir } from '@/utils/imprimir'

interface WebcamCaptureProps {
  open: boolean
  titulo?: string
  onClose: () => void
  onCapture: (file: File) => void
}

const RESOLUCION_MAX = 1280

export default function WebcamCapture({
  open,
  titulo = 'Tomar fotografía',
  onClose,
  onCapture,
}: WebcamCaptureProps) {
  const { Alerta } = useAlerts()

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [capturado, setCapturado] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fotoCapturada, setFotoCapturada] = useState<File | null>(null)

  // ── Iniciar / detener stream ────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return

    let activo = true
    setCargando(true)
    setError(null)
    setCapturado(false)
    setPreview(null)
    setFotoCapturada(null)

    const iniciar = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('MediaDevices no disponible. Verifique que use HTTPS o localhost.')
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        })

        if (!activo) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }
      } catch (e: any) {
        imprimir('Error al iniciar la cámara 🚨', e)
        const nombre = e?.name as string
        if (nombre === 'NotAllowedError') {
          setError('Permiso de cámara denegado. Habilítelo en el navegador.')
        } else if (nombre === 'NotFoundError') {
          setError('No se encontró ninguna cámara o webcam.')
        } else if (nombre === 'NotReadableError') {
          setError('La cámara está siendo usada por otra aplicación.')
        } else {
          setError(e?.message ?? 'No se pudo iniciar la cámara.')
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    void iniciar()

    return () => {
      activo = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [open])

  // ── Capturar frame ──────────────────────────────────────────────────────────
  const capturar = () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    const ancho = Math.min(video.videoWidth || 640, RESOLUCION_MAX)
    const alto = video.videoHeight
      ? Math.round(video.videoHeight * (ancho / (video.videoWidth || ancho)))
      : 480

    const canvas = document.createElement('canvas')
    canvas.width = ancho
    canvas.height = alto
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, ancho, alto)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          Alerta({ mensaje: 'No se pudo procesar la imagen capturada.', variant: 'error' })
          return
        }
        const nombre = `foto-${Date.now()}.jpg`
        const file = new File([blob], nombre, { type: 'image/jpeg' })
        setFotoCapturada(file)
        setPreview(URL.createObjectURL(file))
        setCapturado(true)
      },
      'image/jpeg',
      0.9
    )
  }

  const cerrar = () => {
    if (preview) URL.revokeObjectURL(preview)
    onClose()
  }

  const usarFoto = () => {
    if (!fotoCapturada) return
    onCapture(fotoCapturada)
    if (preview) URL.revokeObjectURL(preview)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" open={open} onClose={cerrar}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[black]/60 z-[999]" />
        </Transition.Child>

        <div className="fixed inset-0 z-[999] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel my-8 w-full max-w-xl overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">{titulo}</h5>
                  <button
                    type="button"
                    className="text-white-dark hover:text-dark"
                    onClick={cerrar}
                  >
                    <IconX />
                  </button>
                </div>

                <div className="p-5">
                  {/* Video en vivo */}
                  {!capturado && (
                    <div className="relative w-full aspect-[4/3] bg-black rounded-md overflow-hidden flex items-center justify-center">
                      {cargando && (
                        <span className="text-gray-400 text-sm animate-pulse">
                          Iniciando cámara...
                        </span>
                      )}
                      {!cargando && !error && (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      )}
                      {!cargando && error && (
                        <div className="text-center px-4">
                          <p className="text-danger text-sm font-semibold">No se pudo iniciar la cámara</p>
                          <p className="text-gray-400 text-xs mt-1">{error}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Vista previa de la foto capturada */}
                  {capturado && preview && (
                    <div className="w-full aspect-[4/3] bg-black rounded-md overflow-hidden flex items-center justify-center">
                      <img src={preview} alt="Foto capturada" className="w-full h-full object-contain" />
                    </div>
                  )}

                  {/* Botones */}
                  <div className="mt-4 flex justify-center gap-2 flex-wrap">
                    {!capturado ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={capturar}
                          disabled={cargando || !!error}
                        >
                          Capturar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={cerrar}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={usarFoto}
                        >
                          Usar fotografía
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setCapturado(false)
                            setPreview(null)
                            setFotoCapturada(null)
                          }}
                        >
                          Retomar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}