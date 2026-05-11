'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Icono } from '@/components/Icono'
import { BackButton } from '@/components/ui/BackButton'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { useAlerts } from '@/hooks/useAlerts'

import { MetadatosSeccion } from './secciones/MetadatosSeccion'
import { FiscalesSeccion } from './secciones/FiscalesSeccion'
import { JurisdiccionSeccion } from './secciones/JurisdiccionSeccion'
import { ControlJurisdiccionalSeccion } from './secciones/ControlJurisdiccionalSeccion'
import { PolicialesSeccion } from './secciones/PolicialesSeccion'
import { ArchivosSeccion } from './secciones/ArchivosSeccion'
import { InvestigadoresSeccion } from './secciones/InvestigadoresSeccion'

import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoService'

type SeccionKey =
  | 'metadatos'
  | 'archivos'
  | 'policiales'
  | 'jurisdiccion'
  | 'control'
  | 'investigadores'
  | 'fiscales'

interface SeccionDef {
  key: SeccionKey
  label: string
  icon: string
}

const SECCIONES: SeccionDef[] = [
  { key: 'metadatos', label: 'ACTUALIZACION DEL INFORME', icon: 'description' },
  { key: 'archivos', label: 'CUADERNO DE INVESTIGACION DIGITAL', icon: 'folder_open' },
  { key: 'policiales', label: 'SERVIDORES POLICIALES (OPERATIVO)', icon: 'local_police' },
  { key: 'jurisdiccion', label: 'JURISDICCION DEL CASO', icon: 'gavel' },
  { key: 'control', label: 'CONTROL JURISDICCIONAL', icon: 'account_balance' },
  { key: 'investigadores', label: 'INVESTIGADOR(ES) ASIGNADO(S)', icon: 'person' },
  { key: 'fiscales', label: 'FISCAL(ES) ASIGNADO(S)', icon: 'person_search' },
]

export function FormSeguimiento() {
  const params = useParams()
  const idCaso = String(params.id)
  const router = useRouter()
  const { Alerta } = useAlerts()

  const [seccionActiva, setSeccionActiva] = useState<SeccionKey>('metadatos')
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState<any>(null)
  const [idOperativo, setIdOperativo] = useState<string | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      // Evitar múltiples llamadas simultáneas si ya está cargando
      // Pero necesitamos la primera carga, así que solo seteamos si no hay datos
      if (!datos) setCargando(true)
      
      const res = await SeguimientoServiceInstance.obtenerDetalle(idCaso)
      if (res.finalizado) {
        setDatos(res.datos)
        const primerOperativoId = res.datos.operativos?.[0]?.id || null
        if (primerOperativoId !== idOperativo) {
          setIdOperativo(primerOperativoId)
        }
      }
    } catch (error) {
      Alerta({ mensaje: 'Error al cargar los datos del caso', variant: 'error' })
    } finally {
      setCargando(false)
    }
  }, [idCaso, Alerta, idOperativo, datos])

  useEffect(() => {
    let active = true
    if (active) {
      void cargarDatos()
    }
    return () => { active = false }
  }, [idCaso]) // Solo re-ejecutar si cambia el idCaso

  const renderSeccion = () => {
    if (!datos) return null

    switch (seccionActiva) {
      case 'metadatos':
        return (
          <MetadatosSeccion
            idCaso={idCaso}
            idOperativo={idOperativo}
            cabecera={datos.cabecera}
            operativo={datos.operativos?.[0]}
            onGuardar={cargarDatos}
          />
        )
      case 'fiscales':
        return (
          <FiscalesSeccion
            idCaso={idCaso}
            datos={datos.fiscales}
            onGuardar={cargarDatos}
          />
        )
      case 'jurisdiccion':
        return (
          <JurisdiccionSeccion
            idCaso={idCaso}
            datos={datos.jurisdicciones}
            onGuardar={cargarDatos}
          />
        )
      case 'control':
        return (
          <ControlJurisdiccionalSeccion
            idCaso={idCaso}
            datos={datos.controles}
            onGuardar={cargarDatos}
          />
        )
      case 'policiales':
        return (
          <PolicialesSeccion
            idOperativo={idOperativo}
            onGuardar={cargarDatos}
          />
        )
      case 'archivos':
        return (
          <ArchivosSeccion
            idCaso={idCaso}
            datos={datos.archivos}
            onGuardar={cargarDatos}
          />
        )
      case 'investigadores':
        return (
          <InvestigadoresSeccion
            idCaso={idCaso}
            datos={datos.investigadores}
            onGuardar={cargarDatos}
          />
        )
      default:
        return null
    }
  }

  if (cargando) {
    return <FullScreenLoading mensaje="Cargando seguimiento del caso..." />
  }

  return (
    <div className="space-y-4">
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h2 className="text-lg font-semibold text-primary">Seguimiento Jurídico (SIII)</h2>
        </div>
        <div className="flex items-center gap-2">
           <span className="badge badge-outline-primary text-sm">
             Caso: {datos?.operativos?.[0]?.numeroCaso || 'S/N'}
           </span>
        </div>
      </div>

      <div className="panel p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50/50 dark:bg-gray-800/20">
          {SECCIONES.map((seccion) => {
            const activa = seccionActiva === seccion.key
            return (
              <button
                key={seccion.key}
                type="button"
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                  activa
                    ? 'border-primary text-primary bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setSeccionActiva(seccion.key)}
              >
                <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>
                  {seccion.icon}
                </Icono>
                {seccion.label}
              </button>
            )
          })}
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 min-h-[500px]">
          {renderSeccion()}
        </div>
      </div>
    </div>
  )
}
