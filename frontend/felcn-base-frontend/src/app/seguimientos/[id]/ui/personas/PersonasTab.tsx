'use client'

import { useState, useEffect } from 'react'
import { Icono } from '@/components/Icono'
import { useAlerts } from '@/hooks/useAlerts'
import { DataTable } from 'mantine-datatable'
import { PersonasServiceInstance } from '@/services/seguimiento/SeguimientoPersonasService'
import { SituacionLegalSeccion } from './SituacionLegalSeccion'
import { EtapaProcesoSeccion } from './EtapaProcesoSeccion'

type TabPersona = 'situacion' | 'etapa'

const TABS_PERSONA: { key: TabPersona; label: string; icon: string }[] = [
  { key: 'situacion', label: 'SITUACIÓN LEGAL DEL IMPLICADO', icon: 'gavel' },
  { key: 'etapa', label: 'ETAPA DEL PROCESO', icon: 'account_balance' },
]

interface Props {
  idCaso: string
  idOperativo: string | null
  cabecera: any
}

export function PersonasTab({ idCaso, idOperativo, cabecera }: Props) {
  const { Alerta } = useAlerts()
  const [personas, setPersonas] = useState<any[]>([])
  const [cargandoPersonas, setCargandoPersonas] = useState(false)
  const [personaSeleccionada, setPersonaSeleccionada] = useState<any | null>(null)
  const [tabActiva, setTabActiva] = useState<TabPersona>('situacion')

  useEffect(() => {
    if (!idOperativo) return
    const cargar = async () => {
      try {
        setCargandoPersonas(true)
        const res = await PersonasServiceInstance.listarPersonasPorOperativo(idOperativo)
        const lista = Array.isArray(res) ? res : res?.datos ?? []
        setPersonas(lista)
      } catch {
        Alerta({ mensaje: 'Error al cargar personas del operativo', variant: 'error' })
      } finally {
        setCargandoPersonas(false)
      }
    }
    void cargar()
  }, [idOperativo])

  return (
    <div className="space-y-6">
      {/* Info del caso */}
      <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <InfoChip label="Número de Caso" value={cabecera?.numeroCaso} />
        <InfoChip label="Número de Operativo" value={cabecera?.nroOperativo} />
        <InfoChip label="CUD Fiscalía" value={cabecera?.ianus} />
        <InfoChip label="Etapa Investigativa" value={cabecera?.etapaInvestigacion} />
        <InfoChip label="Nombre del Caso" value={cabecera?.nombreCaso} className="col-span-2" />
        <InfoChip label="Fiscal Asignado" value={cabecera?.fiscalAsignadoCaso} className="col-span-2" />
      </div>

      {/* Grilla de personas implicadas */}
      <div>
        <h3 className="text-md font-semibold mb-3 dark:text-white-light">PERSONAS IMPLICADAS EN EL OPERATIVO</h3>
        <div className="datatables">
          <DataTable
            noRecordsText={idOperativo ? 'No hay personas registradas para este operativo' : 'Sin operativo asignado'}
            highlightOnHover
            fetching={cargandoPersonas}
            className="whitespace-nowrap table-hover"
            records={personas}
            rowClassName={(row) =>
              personaSeleccionada?.id === row.id ? '!bg-primary/10 font-semibold' : ''
            }
            columns={[
              { accessor: 'codId', title: 'Cod. Id.' },
              { accessor: 'nombreCompleto', title: 'Nombre y Apellidos' },
              { accessor: 'nacionalidad', title: 'Nacionalidad' },
              { accessor: 'genero', title: 'Género' },
              {
                accessor: 'fechaNacimiento',
                title: 'Fecha Nac.',
                render: ({ fechaNacimiento }) =>
                  fechaNacimiento ? new Date(fechaNacimiento).toLocaleDateString('es-BO') : '*'
              },
              { accessor: 'estadoCivil', title: 'Estado Civil' },
              { accessor: 'serie', title: 'Serie' },
              { accessor: 'seccion', title: 'Sección' },
              { accessor: 'condicion', title: 'Condición' },
              {
                accessor: 'acciones',
                title: '',
                render: (row) => (
                  <button
                    type="button"
                    className={`btn btn-sm ${personaSeleccionada?.id === row.id ? 'btn-primary' : 'btn-dark'}`}
                    onClick={() => {
                      setPersonaSeleccionada(row)
                      setTabActiva('situacion')
                    }}
                  >
                    {personaSeleccionada?.id === row.id ? 'Seleccionado' : 'Seleccionar'}
                  </button>
                )
              }
            ]}
          />
        </div>
      </div>

      {/* Panel de gestión jurídica por persona */}
      {personaSeleccionada ? (
        <div className="border border-[#e0e6ed] dark:border-[#1b2e4b] rounded-lg overflow-hidden">
          {/* Indicador de persona activa */}
          <div className="px-4 py-2 bg-primary/5 border-b border-[#e0e6ed] dark:border-[#1b2e4b] flex items-center gap-2">
            <Icono className="w-4 h-4 text-primary">person</Icono>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Implicado:{' '}
              <span className="font-bold text-primary">{personaSeleccionada.nombreCompleto}</span>
            </span>
          </div>

          {/* Tabs situacion / etapa */}
          <div className="flex overflow-x-auto border-b border-[#e0e6ed] dark:border-[#1b2e4b] bg-gray-50/50 dark:bg-gray-800/20">
            {TABS_PERSONA.map((tab) => {
              const activa = tabActiva === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 transition-all ${activa
                    ? 'border-primary text-primary bg-white dark:bg-gray-900'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setTabActiva(tab.key)}
                >
                  <Icono className={`w-5 h-5 ${activa ? 'text-primary' : ''}`}>{tab.icon}</Icono>
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 min-h-[400px]">
            {tabActiva === 'situacion' && (
              <SituacionLegalSeccion idDetenido={String(personaSeleccionada.id)} />
            )}
            {tabActiva === 'etapa' && (
              <EtapaProcesoSeccion idDetenido={String(personaSeleccionada.id)} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <Icono className="w-12 h-12 mb-3">person_search</Icono>
          <p className="text-sm">Seleccione un implicado para gestionar su situación jurídica</p>
        </div>
      )}
    </div>
  )
}

function InfoChip({ label, value, className = '' }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={`flex items-stretch rounded border border-[#e0e6ed] dark:border-[#17263c] overflow-hidden ${className}`}>
      <div className="bg-[#eee] dark:bg-[#1b2e4b] px-2 py-1 text-xs font-semibold flex items-center whitespace-nowrap shrink-0">
        {label}
      </div>
      <div className="px-2 py-1 text-xs font-bold flex-1 flex items-center">
        {value || '-'}
      </div>
    </div>
  )
}
