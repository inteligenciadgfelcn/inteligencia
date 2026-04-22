'use client'
import { useState } from 'react'
import { GestionOperativoListado } from './GestionOperativoListado'
import { Icono } from '@/components/Icono'

export function GestionOperativoTabs() {
  const [tabActiva, setTabActiva] = useState('no-aprobado')

  const TABS = [
    { key: 'no-aprobado', label: 'Casos No Aprobados', icon: 'assignment' },
    { key: 'aprobado', label: 'Casos Aprobados', icon: 'rule' },
    { key: 'pendientes', label: 'Enviados a Fiscalía', icon: 'note' },
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
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-semibold border-b-2 transition-all ${activa
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
        {tabActiva === 'no-aprobado' && (
          <GestionOperativoListado
            tipo="no-aprobado"
            titulo="Gestión de Operativos - No Aprobados"
          />
        )}
        {tabActiva === 'aprobado' && (
          <GestionOperativoListado
            tipo="aprobado"
            titulo="Gestión de Operativos - Aprobados"
          />
        )}
        {tabActiva === 'pendientes' && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Icono className="w-16 h-16 mb-4 opacity-10">note</Icono>
            <p className="text-lg font-medium">Buzón de Operativos Pendientes</p>
            <p className="text-sm text-gray-500">Actualmente no existen operativos pendientes de validación inicial.</p>
          </div>
        )}
      </div>
    </div>
  )
}
