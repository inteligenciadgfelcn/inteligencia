'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { socket } from '@/services/socket'
import IconSave from '../Icon/IconSave'

interface Props {
  id: string
  name_finger: string
  onChangeImage: (image: string | null, calidad: number) => void
}

export default function FingerprintCapture({
  id,
  name_finger,
  onChangeImage,
}: Props) {
  const { sesionPeticion } = useSession()

  const [scannerEstado, setScannerEstado] = useState('DESCONECTADO')
  const [imagen, setImagen] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [estado, setEstado] = useState('esperando')

  useEffect(() => {
    if (!socket.connected) socket.connect()

    const onConnect = () => {
      console.log('🟢 Socket conectado')
    }

    const onScannerStatus = (data: any) => {
      console.log('📡 Estado scanner:', data)
      setScannerEstado(data.estado)
    }

    const onPreview = (data: any) => {
      console.log('📡 Preview huella:', data)

      if (!data?.imagen || data.dedo != id) return

      const img = `data:image/bmp;base64,${data.imagen}`

      setImagen(img)
      setPreview(data)
      onChangeImage(data.imagen, data.calidad)
      setEstado('listo')
    }

    // 🔥 REGISTRAR
    socket.on('connect', onConnect)
    socket.on('scanner-status', onScannerStatus)
    socket.on('fingerprint-preview', onPreview)

    // 🔥 LIMPIAR BIEN
    return () => {
      socket.off('connect', onConnect)
      socket.off('scanner-status', onScannerStatus)
      socket.off('fingerprint-preview', onPreview)
    }
  }, [])

  const capturar = async () => {
    if (scannerEstado !== 'CONECTADO') {
      alert('❌ Scanner no conectado')
      return
    }

    setEstado('capturando')
    onChangeImage('', 0)

    await sesionPeticion({
      url: `${Constantes.baseUrl}/scanner/capturar`,
      method: 'POST',
      body: {
        personaId: 123,
        dedo: id,
      },
    })
  }

  const guardar = async () => {
    if (!preview) return

    if (preview.calidad < 50) {
      alert('⚠️ Calidad baja, reintente')
      return
    }

    await sesionPeticion({
      url: `${Constantes.baseUrl}/huellas/guardar`,
      method: 'POST',
      body: preview,
    })

    alert('✅ Huella guardada')

    setEstado('esperando')
  }

  return (
    <div className="panel p-5 rounded-[10px]">
      <h5 className="text-xl text-center">{name_finger}</h5>

      {/* 🔥 ESTADO SCANNER */}
      {/* <div
        className={`p-2.5 rounded mb-2.5 ${
          scannerEstado === 'CONECTADO' ? 'bg-[#0f5132]' : 'bg-[#842029]'
        }`}
      >
        {scannerEstado === 'CONECTADO'
          ? '🟢 Dermalog conectado'
          : '🔴 Dermalog desconectado'}
      </div> */}

      {/* {estado === 'esperando' && <p>Presione capturar</p>} */}
      {estado === 'capturando' && <p>Capturando...</p>}

      {/* IMAGEN */}
      <div className="w-full h-[200px] bg-white flex items-center justify-center mt-4">
        {imagen ? (
          <img src={imagen} alt="Huella" className="w-full h-full" />
        ) : (
          <span className="text-gray-400">Sin captura</span>
        )}
      </div>

      {/* CALIDAD */}
      {preview && (
        <p className="mt-2.5">
          Calidad:{' '}
          <b
            className={`${
              preview.calidad > 70
                ? 'text-lime-400'
                : preview.calidad > 50
                  ? 'text-orange-400'
                  : 'text-red-500'
            }`}
          >
            {preview.calidad}
          </b>
        </p>
      )}

      {/* BOTONES */}
      <div className="mt-4">
        <button
          type="button"
          onClick={capturar}
          disabled={scannerEstado !== 'CONECTADO'}
          className={`btn w-full px-2.5 py-2 text-white mr-2.5 ${
            scannerEstado === 'CONECTADO'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          Escanear huella
        </button>

        {/* <button
          onClick={guardar}
          disabled={!preview}
          className={`px-2.5 py-2 text-white ${
            preview
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          <IconSave />
        </button> */}
      </div>
    </div>
  )
}
