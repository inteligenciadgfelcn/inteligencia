'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const schema = z.object({
  nroCaso: z.string().min(1, 'Nro de Caso es obligatorio'),
})

type SearchValues = z.infer<typeof schema>

type Props = {
  loading: boolean
  onSearch: (nroCaso: string) => Promise<void>
  onClear: () => void
  casoInfo?: {
    nombreCaso: string
    asignadoAlCaso: string
    fiscalAsignado: string
  } | null
  status: 'idle' | 'success-enabled' | 'success-disabled' | 'not-found'
}

export const CasoSearchCard = ({
  loading,
  onSearch,
  onClear,
  casoInfo,
  status,
}: Props) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SearchValues>({
    resolver: zodResolver(schema),
    defaultValues: { nroCaso: '' },
  })

  const handleClear = () => {
    reset()
    onClear()
  }

  return (
    <div className="panel">
      <h5 className="mb-4 text-base font-semibold">Busqueda de Caso</h5>

      <form onSubmit={handleSubmit(async (values) => onSearch(values.nroCaso))}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <InputWithPrefix
              name="nroCaso"
              prefix="Nro de Caso"
              register={register}
              error={errors.nroCaso?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4 flex gap-2">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleClear}
              disabled={loading}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              Buscar
            </button>
          </div>
        </div>
      </form>

      {(status === 'success-enabled' || status === 'success-disabled') &&
        casoInfo && (
          <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm">
              <strong>Nombre de Caso:</strong> {casoInfo.nombreCaso}
            </p>
            <p className="text-sm">
              <strong>Asignado al Caso:</strong> {casoInfo.asignadoAlCaso}
            </p>
            <p className="text-sm">
              <strong>Fiscal asignado:</strong> {casoInfo.fiscalAsignado}
            </p>
          </div>
        )}

      {status === 'success-disabled' && (
        <div className="mt-3 rounded-md border border-warning/30 bg-warning/10 px-4 py-2 text-sm font-semibold text-warning">
          Operativo ya registrado
        </div>
      )}

      {status === 'not-found' && (
        <div className="mt-3 rounded-md border border-danger/20 bg-danger/5 px-4 py-2 text-sm font-semibold text-danger">
          Caso no encontrado
        </div>
      )}
    </div>
  )
}
