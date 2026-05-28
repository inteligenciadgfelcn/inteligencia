'use client'

import { useState, useEffect } from 'react'
import { GestionAnalisisListado } from './GestionAnalisisListado'
import { Icono } from '@/components/Icono'
import { S2iLookupsService } from '@/services/analisis'
import type { LookupSimple } from '@/services/analisis'

function getIconForEtapa(descripcion: string): string {
  const desc = descripcion.toLowerCase()
  if (desc.includes('pre') || desc.includes('inicio') || desc.includes('primera')) return 'assignment'
  if (desc.includes('inteligencia') || desc.includes('analisis') || desc.includes('análisis')) return 'search'
  if (desc.includes('operativa') || desc.includes('proceso') || desc.includes('ejecucion')) return 'gavel'
  if (desc.includes('cierre') || desc.includes('cerrado') || desc.includes('fin')) return 'check'
  return 'default'
}

export function GestionAnalisisTabs() {
  const [tabActiva, setTabActiva] = useState('todos')
  const [etapas, setEtapas] = useState<LookupSimple[]>([])
  const [cargandoEtapas, setCargandoEtapas] = useState(true)

  useEffect(() => {
    S2iLookupsService.listarEtapasInvestigacion()
      .then((r) => { if (r?.finalizado) setEtapas(r.datos ?? []) })
      .catch(() => { })
      .finally(() => setCargandoEtapas(false))
  }, [])

  const TABS = [
    ...etapas.map((e) => ({
      key: String(e.id),
      label: e.descripcion,
      icon: getIconForEtapa(e.descripcion),
    })),
    { key: 'todos', label: 'Todos los Casos', icon: 'view_list' },
  ]

  return (
    <div className="panel p-0 overflow-hidden">
      {/* Tabs Header */}
      <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
        {TABS.map((tab) => {
          const activa = tabActiva === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activa
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => setTabActiva(tab.key)}
            >
              <Icono className={`w-4 h-4 ${activa ? 'text-primary' : ''}`}>{tab.icon}</Icono>
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-4">
        {cargandoEtapas ? (
          <div className="flex items-center justify-center py-8">
            <span className="animate-spin border-2 border-primary border-l-transparent rounded-full w-6 h-6 mr-2"></span>
            Cargando etapas...
          </div>
        ) : (
          <GestionAnalisisListado
            idEtapa={tabActiva === 'todos' ? undefined : Number(tabActiva)}
          />
        )}
      </div>
    </div>
  )
}
