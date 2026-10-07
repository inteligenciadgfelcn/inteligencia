'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/Button'

import { RegistroCasoApi } from '../api/registro-caso-apd.api'
import type { AsignacionLgiDetalle } from '../types/registro-caso-apd.types'
import { DatosGeneralesForm } from './datos_generales/DatosGeneralesFormApd'
import { PersonasTab } from './personas_investigadas/PersonasTabApd'
import { AntecedentesTab } from './antecedentes_caso/AntecedentesTabApd'
import { InvestigadoresTab } from './investigadores_asignados/InvestigadoresTabApd'
import { abrirPdfEnNuevaPestana } from '@/utils/peticion'

type TabKey =
  | 'datos-generales'
  | 'personas'
  | 'informacion-caso'
  | 'investigadores'

type Modo = 'nuevo' | 'editar' | 'ver'

interface Props {
  casoId?: string | null
  modo?: Modo
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'datos-generales', label: 'Datos generales del caso' },
  { key: 'personas', label: 'Personas investigadas' },
  { key: 'informacion-caso', label: 'Antecedentes del caso' },
  { key: 'investigadores', label: 'Investigadores asignados' },
]

export function RegistroCaso({ casoId, modo = 'nuevo' }: Props) {
  const router = useRouter()

  const isLectura = modo === 'ver'
  const casoActivo = casoId ? Number(casoId) : null

  const [activeTab, setActiveTab] = useState<TabKey>('datos-generales')
  const [casoActivoId, setCasoActivoId] = useState<number | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const casoIdEfectivo = casoActivo ?? casoActivoId

  // ── Caso a editar ────────────────────────────────────────────────────────────
  const {
    data: caso,
    isLoading: isLoadingCaso,
    isError: isErrorCaso,
    error: errorCaso,
  } = useQuery<AsignacionLgiDetalle>({
    queryKey: ['apd-registro-caso', 'caso', casoId],
    queryFn: () => RegistroCasoApi.obtenerCaso(casoId!),
    enabled: Boolean(casoId),
  })

  const onGuardadoExitoso = (casoIdCreado?: number) => {
    if (casoIdCreado !== undefined) {
      setCasoActivoId(casoIdCreado)
      setMensaje('Datos generales registrados correctamente')
      setActiveTab('personas')
    } else {
      setMensaje('Datos generales actualizados correctamente')
    }
  }

  if (casoId && isLoadingCaso) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Cargando datos del caso...</p>
      </div>
    )
  }

  if (casoId && isErrorCaso) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-sm text-red-500">
          Error al cargar el caso: {errorCaso?.message ?? 'Error desconocido'}
        </p>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => router.push('/apd/listado_casos')}
        >
          Volver al listado
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {modo === 'nuevo'
                ? 'Nuevo caso'
                : isLectura
                  ? 'Ver caso'
                  : 'Editar caso'}
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark dark:text-white-light">
              {caso?.nombreCaso || 'Registro de caso LGI'}
            </h2>
            {casoIdEfectivo && (
              <p className="mt-1 text-sm text-gray-500">ID {casoIdEfectivo}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => router.push('/apd/listado_casos')}
            >
              Volver al listado
            </Button>
            {casoIdEfectivo && (
              <Button
                type="button"
                variant="outline-primary"
                onClick={() =>
                  void abrirPdfEnNuevaPestana(RegistroCasoApi.exportarInicioPdf)
                }
              >
                Vista previa
              </Button>
            )}
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
          {mensaje}
        </div>
      )}

      <div className="panel p-0">
        <div className="border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const active = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200'
                    }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-5">
          {activeTab === 'datos-generales' && (
            <DatosGeneralesForm
              casoId={casoId}
              caso={caso}
              isLectura={isLectura}
              onBeforeSave={() => setMensaje(null)}
              onGuardadoExitoso={onGuardadoExitoso}
            />
          )}

          {activeTab === 'personas' && (
            <PersonasTab
              casoId={casoIdEfectivo}
              isLectura={isLectura}
              onIrDatosGenerales={() => setActiveTab('datos-generales')}
              onSiguiente={() => setActiveTab('informacion-caso')}
            />
          )}

          {activeTab === 'informacion-caso' && (
            <AntecedentesTab
              casoId={casoIdEfectivo}
              isLectura={isLectura}
              onVolver={() => setActiveTab('personas')}
              onSiguiente={() => setActiveTab('investigadores')}
            />
          )}

          {activeTab === 'investigadores' && (
            <InvestigadoresTab
              casoId={caso?.casosId ? Number(caso.casosId) : (casoIdEfectivo ?? undefined)}
            />
          )}
        </div>
      </div>
    </div>
  )
}