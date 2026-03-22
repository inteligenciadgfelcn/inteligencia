'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { socket } from '@/services/socket'

export default function FingerprintCapture() {
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

      if (!data?.imagen) return

      const img = `data:image/bmp;base64,${data.imagen}`

      setImagen(img)
      setPreview(data)
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

    await sesionPeticion({
      url: `${Constantes.baseUrl}/scanner/capturar`,
      method: 'POST',
      body: {
        personaId: 123,
        dedo: 'INDICE_DERECHO',
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
    <div
      style={{
        marginTop: 20,
        padding: 20,
        background: '#111',
        color: '#fff',
        borderRadius: 10,
      }}
    >
      <h2>🖐️ Captura de Huella</h2>

      {/* 🔥 ESTADO SCANNER */}
      <div
        style={{
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
          background: scannerEstado === 'CONECTADO' ? '#0f5132' : '#842029',
        }}
      >
        {scannerEstado === 'CONECTADO'
          ? '🟢 Dermalog conectado'
          : '🔴 Dermalog desconectado'}
      </div>

      {estado === 'esperando' && <p>Presione capturar</p>}
      {estado === 'capturando' && <p>📡 Capturando...</p>}

      {/* IMAGEN */}
      <div
        style={{
          width: 250,
          height: 300,
          border: '3px solid #00ffcc',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15,
        }}
      >
        {imagen ? (
          <img
            src={imagen}
            alt="Huella"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <span style={{ color: '#999' }}>Sin captura</span>
        )}
      </div>

      {/* CALIDAD */}
      {preview && (
        <p style={{ marginTop: 10 }}>
          Calidad:{' '}
          <b
            style={{
              color:
                preview.calidad > 70
                  ? 'lime'
                  : preview.calidad > 50
                    ? 'orange'
                    : 'red',
            }}
          >
            {preview.calidad}
          </b>
        </p>
      )}

      {/* BOTONES */}
      <div style={{ marginTop: 15 }}>
        <button
          onClick={capturar}
          disabled={scannerEstado !== 'CONECTADO'}
          style={{
            padding: 10,
            background: scannerEstado === 'CONECTADO' ? '#007bff' : 'gray',
            color: '#fff',
            marginRight: 10,
          }}
        >
          🔄 Reintentar huella
        </button>

        <button
          onClick={guardar}
          disabled={!preview}
          style={{
            padding: 10,
            background: preview ? 'green' : 'gray',
            color: '#fff',
          }}
        >
          💾 Guardar huella
        </button>
      </div>
    </div>
  )
}
