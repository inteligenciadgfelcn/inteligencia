'use client'

import { useMemo, useState } from 'react'

import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'

import type { InicioInvestigacionItem } from '../../types/inicio-investigacion.types'
import { getEstadoBadgeClass } from '../../utils/inicio-investigacion.utils'
import { DataTableCasosPrecedentes } from '../components/DataTableCasosPrecedentes'
import { DataTablePersonasNaturales } from '../components/DataTablePersonasNaturales'
import { DataTablePersonasJuridicas } from '../components/DataTablePersonasJuridicas'
import { DataTableBienesSecuestrados } from '../components/DataTableBienesSecuestrados'

type TabKey =
  | 'caso-precedente'
  | 'personas-naturales'
  | 'bienes-secuestrados'
  | 'personas-juridicas'

type Props = {
  item: InicioInvestigacionItem
}

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'caso-precedente', label: 'Caso Precedente' },
  { key: 'personas-naturales', label: 'Personas Naturales' },
  { key: 'bienes-secuestrados', label: 'Bienes Secuentrados' },
  { key: 'personas-juridicas', label: 'Personas Juridicas' },
]

const placeholderCards: Record<
  TabKey,
  Array<{ label: string; value: string }>
> = {
  'caso-precedente': [
    { label: 'Estado', value: 'Pendiente de consolidación' },
    { label: 'Observación', value: 'Sección preparada para la próxima fase' },
  ],
  'personas-naturales': [
    { label: 'Registros', value: 'Sin datos cargados todavía' },
    { label: 'Acción', value: 'Se conectará con el flujo de detalle luego' },
  ],
  'bienes-secuestrados': [
    { label: 'Registros', value: 'Sin bienes asociados en esta fase' },
    { label: 'Acción', value: 'Pendiente de integración' },
  ],
  'personas-juridicas': [
    { label: 'Registros', value: 'Sin personas jurídicas registradas' },
    { label: 'Acción', value: 'Pendiente de integración' },
  ],
}

export function InicioInvestigacionDetalle({ item }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('caso-precedente')

  const currentCards = useMemo(() => placeholderCards[activeTab], [activeTab])

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Detalle inicio investigacion
            </p>
            <h2 className="mt-1 text-xl font-bold text-dark dark:text-white-light">
              {item.nombreCaso}
            </h2>
            <p className="mt-1 text-sm text-gray-500">ID {item.id}</p>
          </div>

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => history.back()}
          >
            Volver
          </Button>
        </div>
      </div>

      <div className="panel p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Departamento', item.departamento],
            ['Regional', item.regional],
            ['Nombre del Caso', item.nombreCaso],
            ['Nro de Caso FELCN', item.nroCasoFelcn],
            ['Nro de Caso Fiscalia', item.nroCasoFiscalia],
            ['IANUS', item.iaunus],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Estado del Caso
            </p>
            <span
              className={`badge mt-2 ${getEstadoBadgeClass(item.estadoCaso)}`}
            >
              {item.estadoCaso}
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Nro de Caso FELCN
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {item.nroCasoFelcn}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Nro de Caso Fiscalia
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {item.nroCasoFiscalia}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Fecha remisión
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {dayjs(item.fechaRemision).format('DD/MM/YYYY')}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Fiscal que Remite
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {item.fiscalQueRemite}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-[#1b2e4b] dark:bg-[#0f172a]">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Conforme a
            </p>
            <p className="mt-1 text-sm font-semibold text-dark dark:text-white-light">
              {item.conformeA}
            </p>
          </div>
        </div>
      </div>

      <div className="panel p-0">
        <div className="border-b border-[#e0e6ed] dark:border-[#1b2e4b]">
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const active = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  type="button"
                  className={`border-b-2 px-5 py-4 text-sm font-semibold transition ${
                    active
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
          {activeTab === 'caso-precedente' ? (
            <DataTableCasosPrecedentes />
          ) : activeTab === 'personas-naturales' ? (
            <DataTablePersonasNaturales />
          ) : activeTab === 'personas-juridicas' ? (
            <DataTablePersonasJuridicas />
          ) : (
            <DataTableBienesSecuestrados />
          )}
        </div>
      </div>
    </div>
  )
}
