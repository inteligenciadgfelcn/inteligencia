'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Icono } from '@/components/Icono'
import { BackButton } from '@/components/ui/BackButton'
import { FullScreenLoading } from '@/components/progreso/FullScreenLoading'
import { useAlerts } from '@/hooks/useAlerts'

import { PersonasTab } from './personas/PersonasTab'
import { CasosTab } from './casos/CasosTab'
import { BienesTab } from './bienes/BienesTab'

import { SeguimientoServiceInstance } from '@/services/seguimiento/SeguimientoCasosService'

type TabPrincipal = 'casos' | 'personas' | 'bienes'





interface Props {
  idCaso: string
  tabInicial: TabPrincipal
}

export function FormSeguimiento({ idCaso, tabInicial }: Props) {
  const router = useRouter()
  const { Alerta } = useAlerts()

  const [tabPrincipal, setTabPrincipal] = useState<TabPrincipal>(tabInicial)
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState<any>(null)
  const [idOperativo, setIdOperativo] = useState<string | null>(null)

  const cargarDatos = useCallback(async () => {
    try {
      // Solo mostrar loading la primera vez o si no hay datos
      setCargando((prev) => !datos && prev)
      const res = await SeguimientoServiceInstance.obtenerDetalle(idCaso)
      if (res.finalizado) {
        setDatos(res.datos)
        const primerOperativoId = res.datos.operativos?.[0]?.id || null
        setIdOperativo(primerOperativoId)
      }
    } catch {
      Alerta({ mensaje: 'Error al cargar los datos del caso', variant: 'error' })
    } finally {
      setCargando(false)
    }
  }, [idCaso, Alerta])

  useEffect(() => {
    void cargarDatos()
  }, [idCaso, cargarDatos])

  // Sincronizar tab si cambia el prop (desde el URL)
  useEffect(() => {
    setTabPrincipal(tabInicial)
  }, [tabInicial])





  if (cargando) {
    return <FullScreenLoading mensaje="Cargando seguimiento del caso..." />
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="panel flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h2 className="text-lg font-semibold text-primary">Seguimiento de Casos Jurídico</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-outline-primary text-sm">
            Caso: {datos?.operativos?.[0]?.numeroCaso || datos?.cabecera?.numeroCaso || 'S/N'}
          </span>
        </div>
      </div>

      {/* Tabs principales: CASOS | PERSONAS | BIENES */}
      <div className="panel p-0 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          {(['casos', 'personas', 'bienes'] as TabPrincipal[]).map((tab) => {
            const activa = tabPrincipal === tab
            const label = tab.charAt(0).toUpperCase() + tab.slice(1)
            const icon = tab === 'casos' ? 'description' : tab === 'personas' ? 'people' : 'home'

            return (
              <button
                key={tab}
                type="button"
                className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium border-b-2 transition-all ${activa
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setTabPrincipal(tab)}
              >
                <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>
                  {icon}
                </Icono>
                {label.toUpperCase()}
              </button>
            )
          })}
        </div>


        {/* Contenido según Tab */}
        {tabPrincipal === 'casos' && (
          <CasosTab
            idCaso={idCaso}
            idOperativo={idOperativo}
            datos={datos}
            onGuardar={cargarDatos}
          />
        )}

        {tabPrincipal === 'personas' && (
          <div className="p-6 bg-white dark:bg-gray-900 min-h-[500px]">
            <PersonasTab
              idCaso={idCaso}
              idOperativo={idOperativo}
              cabecera={datos?.cabecera}
            />
          </div>
        )}

        {tabPrincipal === 'bienes' && (
          <div className="p-6 bg-white dark:bg-gray-900 min-h-[500px]">
            <BienesTab
              idCaso={idCaso}
              idOperativo={idOperativo}
              cabecera={datos?.cabecera}
            />
          </div>
        )}
      </div>
    </div>
  )
}
