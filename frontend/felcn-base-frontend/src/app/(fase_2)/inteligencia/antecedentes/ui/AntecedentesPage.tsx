'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useAlerts } from '@/hooks'
import { InterpreteMensajes } from '@/utils'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { Column, VristoDataTable } from '@/components/datatable/VristoDataTable'

import { getAntecedentes } from '../services/antecedentes.service'
import {
  AntecedenteItem,
  AntecedentesSearchFormValues,
  AntecedentesSearchParams,
} from '../types/antecedentes.types'

const defaultValues: AntecedentesSearchFormValues = {
  ci: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
}

export function AntecedentesPage() {
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [rows, setRows] = useState<AntecedenteItem[]>([])

  const { Alerta } = useAlerts()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AntecedentesSearchFormValues>({
    defaultValues,
  })

  const paginatedRows = useMemo(() => {
    const from = (page - 1) * limit
    const to = from + limit

    return rows.slice(from, to)
  }, [rows, page, limit])

  const columns: Column<AntecedenteItem>[] = [
    {
      accessor: 'nombreCompleto',
      title: 'Nombre completo',
      sortable: true,
    },
    {
      accessor: 'ci',
      title: 'CI',
      sortable: true,
    },
    {
      accessor: 'cantidadOperativos',
      title: 'Cantidad operativos',
      sortable: true,
    },
    {
      accessor: 'tieneAntecedentes',
      title: 'Tiene antecedentes',
      sortable: true,
      render: (row) => (
        <span
          className={row.tieneAntecedentes ? 'text-danger' : 'text-success'}
        >
          {row.tieneAntecedentes ? 'Si' : 'No'}
        </span>
      ),
    },
  ]

  const onBuscar = async (values: AntecedentesSearchFormValues) => {
    const params: AntecedentesSearchParams = {
      ci: values.ci,
      nombre: values.nombre,
      apellidoPaterno: values.apellidoPaterno,
      apellidoMaterno: values.apellidoMaterno,
    }

    const hasAtLeastOneCriterion = Object.values(params).some((value) =>
      value?.trim()
    )

    if (!hasAtLeastOneCriterion) {
      Alerta({
        mensaje: 'Debe ingresar al menos un criterio de busqueda.',
        variant: 'error',
      })
      return
    }

    setLoading(true)
    setHasSearched(true)
    setPage(1)
    setRows([])

    try {
      const response = await getAntecedentes(params)
      setRows(response.data ?? [])
    } catch (error) {
      Alerta({
        mensaje: InterpreteMensajes(error),
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const onLimpiar = () => {
    reset(defaultValues)
    setRows([])
    setHasSearched(false)
    setPage(1)
  }

  return (
    <div className="mb-5">
      {/* Breadcumb */}
      <div className="mb-5">
        <ol className="flex text-primary font-semibold dark:text-white-dark">
          <li className="bg-[#ebedf2] ltr:rounded-l-md rtl:rounded-r-md dark:bg-[#1b2e4b]">
            <button className="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">
              Inicio
            </button>
          </li>
          <li className="bg-[#ebedf2] dark:bg-[#1b2e4b]">
            <button className="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">
              Antecedentes
            </button>
          </li>
        </ol>
      </div>
      {/* End breadcum */}
      <div className="panel mb-4">
        <h5 className="font-semibold text-lg mb-4">Busqueda de antecedentes</h5>

        <form onSubmit={handleSubmit(onBuscar)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <InputWithPrefix
                name="ci"
                prefix="CI"
                icon="person"
                placeholder="Ingrese CI"
                register={register}
                error={errors.ci?.message}
              />
            </div>

            <div className="md:col-span-3">
              <InputWithPrefix
                name="nombre"
                prefix="Nombre"
                icon="person"
                placeholder="Ingrese nombre"
                register={register}
                error={errors.nombre?.message}
              />
            </div>

            <div className="md:col-span-3">
              <InputWithPrefix
                name="apellidoPaterno"
                prefix="Paterno"
                icon="person"
                placeholder="Ingrese apellido paterno"
                register={register}
                error={errors.apellidoPaterno?.message}
              />
            </div>

            <div className="md:col-span-3">
              <InputWithPrefix
                name="apellidoMaterno"
                prefix="Materno"
                icon="person"
                placeholder="Ingrese apellido materno"
                register={register}
                error={errors.apellidoMaterno?.message}
              />
            </div>

            <div className="md:col-span-12 flex items-end gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onLimpiar}
                disabled={loading}
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>

      {hasSearched && (
        <VristoDataTable<AntecedenteItem>
          title="Resultados"
          rows={paginatedRows}
          total={rows.length}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(value) => {
            setLimit(value)
            setPage(1)
          }}
          columns={columns}
          loading={loading}
        />
      )}
    </div>
  )
}

export default AntecedentesPage
