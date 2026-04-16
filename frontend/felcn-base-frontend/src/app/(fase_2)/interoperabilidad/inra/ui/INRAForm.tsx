'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import IconEye from '@/components/Icon/IconEye'
import { Column, VristoDataTable } from '@/components/datatable/VristoDataTable'
import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { Card } from '@/components/ui/Card'
import {
  buscarInraPorNumeroIdentificacionFake,
  buscarInraPorNumeroTituloFake,
  InraBeneficiario,
  InraResponse,
  InraSearchType,
  InraTitulo,
} from '../services/inra.service'
import { BeneficiariosDialog } from './BeneficiariosDialog'

interface TipoBusquedaOption {
  value: InraSearchType
  label: string
}

interface INRAFormValues {
  datoBusqueda: string
  tipoBusqueda: TipoBusquedaOption | null
}

const TIPO_BUSQUEDA_OPTIONS: TipoBusquedaOption[] = [
  { value: 'TITULO', label: 'Nro Titulo' },
  { value: 'IDENTIFICACION', label: 'Nro Identificacion' },
]

export const INRAForm = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<INRAFormValues>({
    defaultValues: {
      datoBusqueda: '',
      tipoBusqueda: null,
    },
  })

  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState<InraResponse | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [beneficiarios, setBeneficiarios] = useState<InraBeneficiario[]>([])

  const titulos = resultado?.respuestaTitulos ?? []

  const rows = useMemo(() => {
    const from = (page - 1) * limit
    const to = from + limit
    return titulos.slice(from, to)
  }, [titulos, page, limit])

  const columns: Column<InraTitulo>[] = [
    {
      accessor: 'numeroTitulo',
      title: 'Nro Titulo',
    },
    {
      accessor: 'fechaTitulo',
      title: 'Fecha Titulo',
    },
    {
      accessor: 'nombrePredio',
      title: 'Nombre Predio',
    },
    {
      accessor: 'superficie',
      title: 'Superficie',
      render: (row) => row.superficie.toFixed(4),
    },
    {
      accessor: 'claseTitulo',
      title: 'Clase Titulo',
    },
    {
      accessor: 'departamento',
      title: 'Departamento',
    },
    {
      accessor: 'municipio',
      title: 'Municipio',
    },
    {
      accessor: 'acciones',
      title: 'Beneficiarios',
      render: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setBeneficiarios(row.beneficiariosList)
            setDialogOpen(true)
          }}
          title="Ver beneficiarios"
        >
          <IconEye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const onBuscar = async (values: INRAFormValues) => {
    if (!values.tipoBusqueda || !values.datoBusqueda.trim()) {
      return
    }

    setLoading(true)
    setPage(1)

    try {
      let response: InraResponse
      if (values.tipoBusqueda.value === 'TITULO') {
        response = await buscarInraPorNumeroTituloFake(values.datoBusqueda)
      } else {
        response = await buscarInraPorNumeroIdentificacionFake(
          values.datoBusqueda
        )
      }

      setResultado(response)
    } finally {
      setLoading(false)
    }
  }

  const onLimpiar = () => {
    reset({
      datoBusqueda: '',
      tipoBusqueda: null,
    })
    setResultado(null)
    setPage(1)
    setBeneficiarios([])
    setDialogOpen(false)
  }

  const mensajePrincipal = resultado?.mensajes?.[0]?.mensaje
  const sinResultados = resultado?.respuestaTitulos === null

  return (
    <div className="mb-5">
      <Card title="Busqueda INRA" className="mb-4">
        <form onSubmit={handleSubmit(onBuscar)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <InputWithPrefix
                name="datoBusqueda"
                prefix="Nro titulo o Nro CI"
                placeholder="Nro titulo o Nro CI"
                register={register}
                error={errors.datoBusqueda?.message}
              />
            </div>
            <div className="md:col-span-4">
              <AsyncSearchSelect<TipoBusquedaOption>
                name="tipoBusqueda"
                control={control}
                prefix="Tipo"
                originalData={TIPO_BUSQUEDA_OPTIONS}
                mapOption={(item) => ({
                  label: item.label,
                  value: item.value,
                  original: item,
                })}
                error={errors.tipoBusqueda?.message as string | undefined}
              />
            </div>
            <div className="md:col-span-3 flex items-end gap-2">
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
      </Card>

      {resultado && (
        <Card title="Resultados INRA" className="mb-4">
          {mensajePrincipal && (
            <p className="mb-3 text-sm text-primary">{mensajePrincipal}</p>
          )}

          {sinResultados && (
            <div className="rounded-md border border-warning bg-warning-light/20 p-3 text-warning">
              No se encontro resultados con esta informacion
            </div>
          )}

          {!sinResultados && (
            <VristoDataTable<InraTitulo>
              rows={rows}
              total={titulos.length}
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
        </Card>
      )}

      <BeneficiariosDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        beneficiarios={beneficiarios}
      />
    </div>
  )
}
