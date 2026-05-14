'use client'
import { useState } from 'react'
import { GestionOperativoListado } from './GestionOperativoListado'
import { Icono } from '@/components/Icono'

export function GestionOperativoTabs() {
  const [tabActiva, setTabActiva] = useState('no-aprobado')

  const TABS = [
    { key: 'no-aprobado', label: 'Registro de Operativos', icon: 'assignment' },
    { key: 'impresion', label: 'Impresión de Informe operativo', icon: 'print' },
    { key: 'envio-fiscalia', label: 'Envio a la fiscalia', icon: 'send' },
    { key: 'con-cud', label: 'Enviados a Fiscalía', icon: 'verified' },
    { key: 'todos', label: 'Todos mis Casos', icon: 'list_alt' },
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
          />
        )}
        {tabActiva === 'impresion' && (
          <GestionOperativoListado
            tipo="impresion"
          />
        )}
        {tabActiva === 'envio-fiscalia' && (
          <GestionOperativoListado
            tipo="envio-fiscalia"
          />
        )}
        {tabActiva === 'con-cud' && (
          <GestionOperativoListado
            tipo="con-cud"
          />
        )}
        {tabActiva === 'todos' && (
          <GestionOperativoListado
            tipo="todos"
          />
        )}
      </div>
    </div>
  )
}
