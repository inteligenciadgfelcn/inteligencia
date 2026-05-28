'use client'

import { useState } from 'react'
import { Icono } from '@/components/Icono'
import { MetadatosSeccion } from './MetadatosSeccion'
import { FiscalesSeccion } from './FiscalesSeccion'
import { JurisdiccionSeccion } from './JurisdiccionSeccion'
import { ControlJurisdiccionalSeccion } from './ControlJurisdiccionalSeccion'
import { PolicialesSeccion } from './PolicialesSeccion'
import { ArchivosSeccion } from './ArchivosSeccion'
import { InvestigadoresSeccion } from './InvestigadoresSeccion'

type SeccionKey =
  | 'metadatos'
  | 'archivos'
  | 'policiales'
  | 'jurisdiccion'
  | 'control'
  | 'investigadores'
  | 'fiscales'

const SECCIONES_CASOS = [
  { key: 'metadatos' as SeccionKey, label: 'Actualización del Informe', icon: 'description' },
  { key: 'archivos' as SeccionKey, label: 'Cuaderno de Investigación Digital', icon: 'note' },
  { key: 'policiales' as SeccionKey, label: 'Servidores Policiales (Operativo)', icon: 'person' },
  { key: 'jurisdiccion' as SeccionKey, label: 'Jurisdicción del Caso', icon: 'gavel' },
  { key: 'control' as SeccionKey, label: 'Control Jurisdiccional', icon: 'account_balance' },
  { key: 'investigadores' as SeccionKey, label: 'Investigador(es) Asignado(s)', icon: 'person' },
  { key: 'fiscales' as SeccionKey, label: 'Fiscal(es) Asignado(s)', icon: 'user' },
]

interface Props {
  idCaso: string
  idOperativo: string | null
  datos: any
  onGuardar: () => void
}

export function CasosTab({ idCaso, idOperativo, datos, onGuardar }: Props) {
  const [seccionActiva, setSeccionActiva] = useState<SeccionKey>('metadatos')

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
            onGuardar={onGuardar}
          />
        )
      case 'fiscales':
        return <FiscalesSeccion idCaso={idCaso} datos={datos.fiscales} onGuardar={onGuardar} />
      case 'jurisdiccion':
        return <JurisdiccionSeccion idCaso={idCaso} datos={datos.jurisdicciones} onGuardar={onGuardar} />
      case 'control':
        return <ControlJurisdiccionalSeccion idCaso={idCaso} datos={datos.controles} onGuardar={onGuardar} />
      case 'policiales':
        return <PolicialesSeccion idOperativo={idOperativo} onGuardar={onGuardar} />
      case 'archivos':
        return <ArchivosSeccion idCaso={idCaso} datos={datos.archivos} onGuardar={onGuardar} />
      case 'investigadores':
        return <InvestigadoresSeccion idCaso={idCaso} datos={datos.investigadores} onGuardar={onGuardar} />
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50/50 dark:bg-gray-800/20">
        {SECCIONES_CASOS.map((seccion) => {
          const activa = seccionActiva === seccion.key
          return (
            <button
              key={seccion.key}
              type="button"
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-3 text-sm font-medium border-b-2 transition-all ${activa
                ? 'border-secondary text-secondary bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-secondary hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              onClick={() => setSeccionActiva(seccion.key)}
            >
              <Icono className={`w-4 h-4 ${activa ? 'text-secondary' : ''}`}>
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
    </>
  )
}
