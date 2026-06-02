'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MultiSelect } from '@/components/form/FormMultiSelect'
import { VristoDataTable } from '@/components/datatable/VristoDataTable'
import type { Column } from '@/components/datatable/VristoDataTable'
import IconEye from '@/components/Icon/IconEye'
import IconSearch from '@/components/Icon/IconSearch'

import type {
  InicioInvestigacionBusquedaCriterio,
  InicioInvestigacionFilters,
  InicioInvestigacionItem,
  SelectOption,
} from '../types/inicio-investigacion.types'
import {
  departamentoOptions,
  estadoOptions,
  filterInvestigaciones,
  getEstadoBadgeClass,
  inicioInvestigacionInitialFilters,
  investigadorOptions,
  mockInvestigaciones,
  regionalOptions,
} from '../utils/inicio-investigacion.utils'

const topSearchOptions: SelectOption[] = [
  { value: 'investigador', label: 'Investigador' },
  { value: 'departamento', label: 'Departamento' },
]

const pageSizeOptions = [10, 20, 30, 50]

export function InicioInvestigacionListado() {
  const router = useRouter()
  const [filters, setFilters] = useState<InicioInvestigacionFilters>(
    inicioInvestigacionInitialFilters
  )
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const allRows = useMemo(() => mockInvestigaciones, [])

  const filteredRows = useMemo(
    () => filterInvestigaciones(allRows, filters),
    [allRows, filters]
  )

  const total = filteredRows.length

  const pagedRows = useMemo(() => {
    const start = (page - 1) * limit
    return filteredRows.slice(start, start + limit)
  }, [filteredRows, page, limit])

  const updateFilters = (patch: Partial<InicioInvestigacionFilters>) => {
    setFilters((current) => ({ ...current, ...patch }))
    setPage(1)
  }

  const handleTopSearchCriterionChange = (
    criterio: InicioInvestigacionBusquedaCriterio
  ) => {
    updateFilters({ busquedaCriterio: criterio, busquedaValor: '' })
  }

  const topSearchValueOptions =
    filters.busquedaCriterio === 'investigador'
      ? investigadorOptions
      : departamentoOptions

  const columns: Column<InicioInvestigacionItem>[] = [
    {
      accessor: 'id',
      title: 'ID',
      sortable: true,
    },
    {
      accessor: 'regional',
      title: 'Regional',
      render: (row) => <span>{row.regional}</span>,
    },
    {
      accessor: 'nombreCaso',
      title: 'Nombre del caso',
      render: (row) => <span className="font-medium">{row.nombreCaso}</span>,
    },
    {
      accessor: 'estadoCaso',
      title: 'Estado del Caso',
      render: (row) => (
        <span className={`badge ${getEstadoBadgeClass(row.estadoCaso)}`}>
          {row.estadoCaso}
        </span>
      ),
    },
    { accessor: 'nroCasoGiaef', title: 'Nro Caso GIAEF' },
    { accessor: 'nroCasoFelcn', title: 'Nro Caso FELCN' },
    { accessor: 'nroCasoFiscalia', title: 'Nro Caso Fiscalía' },
    { accessor: 'nroPerdidaDominio', title: 'Nro Pérdida de dominio' },
    { accessor: 'iaunus', title: 'IAUNUS' },
    { accessor: 'fiscalQueRemite', title: 'Fiscal que Remite' },
    {
      accessor: 'fechaRemision',
      title: 'Fecha remisión',
      render: (row) =>
        row.fechaRemision ? dayjs(row.fechaRemision).format('DD/MM/YYYY') : '-',
    },
    { accessor: 'conformeA', title: 'Conforme a' },
    {
      accessor: 'acciones',
      title: 'Acciones',
      render: (row) => (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-1 text-primary transition hover:bg-primary/10"
          onClick={() => {
            router.push(`/lgi/inicio_investigacion/${row.id}`)
          }}
          aria-label={`Ver detalle de ${row.nombreCaso}`}
          title="Ver detalle"
        >
          <IconEye className="h-5 w-5" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="panel px-5 py-4">
        <h2 className="text-xl font-bold text-dark dark:text-white-light">
          Inicio investigación
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Pantalla de listado de investigaciones.
        </p>
      </div>

      <div className="panel space-y-5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid w-full gap-4 md:grid-cols-3 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Regional
              </label>
              <MultiSelect
                options={regionalOptions}
                value={filters.regionales}
                onChange={(values) => updateFilters({ regionales: values })}
                placeholder="Seleccione regionales"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Estado del Caso
              </label>
              <MultiSelect
                options={estadoOptions}
                value={filters.estadosCaso}
                onChange={(values) => updateFilters({ estadosCaso: values })}
                placeholder="Seleccione estados"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nombre del caso
              </label>
              <Input
                value={filters.nombreCaso}
                onChange={(e) => updateFilters({ nombreCaso: e.target.value })}
                placeholder="Filtrar por nombre"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nro Caso GIAEF
              </label>
              <Input
                value={filters.nroCasoGiaef}
                onChange={(e) =>
                  updateFilters({ nroCasoGiaef: e.target.value })
                }
                placeholder="Filtrar por GIAEF"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nro Caso FELCN
              </label>
              <Input
                value={filters.nroCasoFelcn}
                onChange={(e) =>
                  updateFilters({ nroCasoFelcn: e.target.value })
                }
                placeholder="Filtrar por FELCN"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nro Caso Fiscalía
              </label>
              <Input
                value={filters.nroCasoFiscalia}
                onChange={(e) =>
                  updateFilters({ nroCasoFiscalia: e.target.value })
                }
                placeholder="Filtrar por Fiscalía"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Nro Pérdida de dominio
              </label>
              <Input
                value={filters.nroPerdidaDominio}
                onChange={(e) =>
                  updateFilters({ nroPerdidaDominio: e.target.value })
                }
                placeholder="Filtrar por pérdida de dominio"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Fecha remisión
              </label>
              <Input
                type="date"
                value={filters.fechaRemision}
                onChange={(e) =>
                  updateFilters({ fechaRemision: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-end gap-3">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setFilters(inicioInvestigacionInitialFilters)
                setPage(1)
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
          <div className="mb-3 flex flex-wrap items-end gap-4">
            <div className="w-full max-w-xs">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                Buscar por
              </label>
              <Select
                options={topSearchOptions}
                value={filters.busquedaCriterio}
                onChange={(e) =>
                  handleTopSearchCriterionChange(
                    e.target.value as InicioInvestigacionBusquedaCriterio
                  )
                }
              />
            </div>

            <div className="w-full max-w-md">
              <label className="mb-1 block text-sm font-semibold text-dark dark:text-white-light">
                {filters.busquedaCriterio === 'investigador'
                  ? 'Investigador'
                  : 'Departamento'}
              </label>
              <Select
                options={topSearchValueOptions}
                value={filters.busquedaValor}
                placeholder={
                  filters.busquedaCriterio === 'investigador'
                    ? 'Seleccione un investigador'
                    : 'Seleccione un departamento'
                }
                onChange={(e) =>
                  updateFilters({ busquedaValor: e.target.value })
                }
              />
            </div>

            <Button
              type="button"
              variant="primary"
              className="gap-2"
              onClick={() => setPage(1)}
            >
              <IconSearch className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>

        <VristoDataTable<InicioInvestigacionItem>
          title="Listado de investigaciones"
          rows={pagedRows}
          total={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          columns={columns}
        />
      </div>
    </div>
  )
}
