import React, { useState } from 'react'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { Column, VristoDataTable } from '@/components/datatable/VristoDataTable'
import {
  NombresSupuestosItem,
  registerNombresSupuestos,
  listNombresSupuestos,
} from '../services/nombres.supuestos.service'

const formSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  apPaterno: z.string().min(1, 'El apellido paterno es requerido'),
  apMaterno: z.string().min(1, 'El apellido materno es requerido'),
  apEsposo: z.string().min(1, 'El apellido de esposo es requerido'),
})

type FormValues = z.infer<typeof formSchema>

interface FormNombresSupuestosProps {
  idDetenido?: number
}

export function FormNombresSupuestos({
  idDetenido,
}: FormNombresSupuestosProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const query = useQuery({
    queryKey: ['nombres-supuestos', idDetenido],
    queryFn: () => listNombresSupuestos(idDetenido ?? 0),
    enabled: !!idDetenido,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) => registerNombresSupuestos(payload),
    onSuccess: () => {
      query.refetch()
      reset()
    },
  })

  const onSubmitSupuestos = (values: FormValues) => {
    if (!idDetenido) return

    const payload = {
      idDetenido,
      nombres: values.nombres,
      paterno: values.apPaterno,
      materno: values.apMaterno,
      apellidoEsposo: values.apEsposo,
    }

    mutation.mutate(payload)
  }

  return (
    <div className="panel p-4">
      <h2 className="text-lg font-semibold text-primary mb-4">
        Nombres Supuestos
      </h2>

      <form onSubmit={handleSubmit(onSubmitSupuestos)}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <InputWithPrefix
              name="nombres"
              prefix="Nombre(s)"
              error={errors.nombres?.message}
              register={register}
            />
          </div>
          <div className="md:col-span-3">
            <InputWithPrefix
              name="apPaterno"
              prefix="Ap. Paterno"
              error={errors.apPaterno?.message}
              register={register}
            />
          </div>
          <div className="md:col-span-3">
            <InputWithPrefix
              name="apMaterno"
              prefix="Ap. Materno"
              error={errors.apMaterno?.message}
              register={register}
            />
          </div>
          <div className="md:col-span-3">
            <InputWithPrefix
              name="apEsposo"
              prefix="Ap. Esposo"
              error={errors.apEsposo?.message}
              register={register}
            />
          </div>
        </div>
        <div className="col-span-12 mt-6 flex gap-4">
          <button type="submit" className="btn btn-sm btn-primary w-full md:w-auto">
            Agregar nombres supuestos
          </button>
        </div>
      </form>

      {idDetenido && (
        <div className="mt-4 overflow-x-auto">
          <VristoDataTable<NombresSupuestosItem>
            rows={query.data ?? []}
            total={query.data?.length ?? 0}
            page={page}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => setLimit(l)}
            columns={[
              { accessor: 'idNombresSupuestos', title: 'ID' },
              { accessor: 'nombres', title: 'Nombres' },
              { accessor: 'paterno', title: 'Ap. Paterno' },
              { accessor: 'materno', title: 'Ap. Materno' },
              { accessor: 'apellidoEsposo', title: 'Ap. Esposo' },
            ]}
            loading={query.isLoading}
          />
        </div>
      )}
    </div>
  )
}
