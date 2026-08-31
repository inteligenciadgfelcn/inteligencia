'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'
import {
  getParentescos,
  Parentesco,
  DatosFamiliaresItem,
  registerDatosFamiliares,
  listDatosFamiliares,
} from '../services/parentesco.service'
import { Column, VristoDataTable } from '@/components/datatable/VristoDataTable'
import { zodResolver } from '@hookform/resolvers/zod'

interface OptionBase {
  id: number
  descripcion: string
}

const selectSchema = (message: string) =>
  z.preprocess(
    (val) => (val === null ? undefined : val),
    z.object(
      {
        value: z.number(),
        label: z.string(),
      },
      { required_error: message }
    )
  )

const formSchema = z.object({
  parentesco: selectSchema('El parentesco es requerido'),
  nombres: z.string().min(1, 'El nombre es requerido'),
  apPaterno: z.string().min(1, 'El apellido paterno es requerido'),
  apMaterno: z.string().min(1, 'El apellido materno es requerido'),
  edad: z.string().min(1, 'La edad es requerida'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  estado: selectSchema('El estado es requerido'),
  implicado: selectSchema('El campo implicado es requerido'),
})

type FormValues = z.infer<typeof formSchema>

const IMPLICADO_OPTIONS: OptionBase[] = [
  { id: 1, descripcion: 'SI' },
  { id: 2, descripcion: 'NO' },
]

const ESTADO_OPTIONS: OptionBase[] = [
  { id: 1, descripcion: 'Vivo' },
  { id: 2, descripcion: 'Fallecido' },
]

interface FormParentescoProps {
  idDetenido?: number
}

export function FormParentesco({ idDetenido }: FormParentescoProps) {
  const {
    register: registerParentesco,
    control: controlParentezco,
    handleSubmit: handleSubmitParentesco,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const { data: parentescos } = useQuery({
    queryKey: ['filiacion', 'parentesco'],
    queryFn: getParentescos,
    placeholderData: keepPreviousData,
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const datosQuery = useQuery({
    queryKey: ['datos-familiares', idDetenido],
    queryFn: () => listDatosFamiliares(idDetenido ?? 0),
    enabled: !!idDetenido,
    placeholderData: keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn: (payload: any) => registerDatosFamiliares(payload),
    onSuccess: () => {
      datosQuery.refetch()
      reset()
    },
  })

  const onSubmitParentesco = (values: FormValues) => {
    if (!idDetenido) return

    const payload = {
      idDetenido,
      idParentezco: values.parentesco.value,
      nombres: values.nombres,
      paterno: values.apPaterno,
      materno: values.apMaterno,
      edad: Number(values.edad) || values.edad,
      direccion: values.direccion,
      telefono: values.telefono,
      vivo: values.estado.value === 1,
      implicado: values.implicado.value === 1,
    }

    mutation.mutate(payload)
  }

  return (
    <div className="mb-5">
      <div className="panel p-4">
        <h2 className="text-lg font-semibold text-primary mb-4">Parentescos</h2>

        <form onSubmit={handleSubmitParentesco(onSubmitParentesco)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <AsyncSearchSelect<Parentesco>
                name="parentesco"
                control={controlParentezco}
                prefix="Parentesco"
                originalData={parentescos || []}
                error={errors.parentesco?.message}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.idParentezco,
                  original: item,
                })}
              />
            </div>
            <div className="hidden md:block md:col-span-6"></div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="nombres"
                prefix="Nombre(s)"
                error={errors.nombres?.message}
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="apPaterno"
                prefix="Ap. Paterno"
                error={errors.apPaterno?.message}
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="apMaterno"
                prefix="Ap. Materno"
                error={errors.apMaterno?.message}
                register={registerParentesco}
              />
            </div>

            <div className="md:col-span-4">
              <InputWithPrefix
                name="edad"
                prefix="Edad"
                error={errors.edad?.message}
                register={registerParentesco}
                onlyNumbers
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="direccion"
                prefix="Direccion"
                error={errors.direccion?.message}
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="telefono"
                prefix="Telefono"
                error={errors.telefono?.message}
                register={registerParentesco}
                onlyNumbers
              />
            </div>

            <div className="md:col-span-6">
              <AsyncSearchSelect<OptionBase>
                name="estado"
                control={controlParentezco}
                prefix="Estado"
                error={errors.estado?.message}
                originalData={ESTADO_OPTIONS}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
              />
            </div>
            <div className="md:col-span-6">
              <AsyncSearchSelect<OptionBase>
                name="implicado"
                control={controlParentezco}
                prefix="Implicado"
                originalData={IMPLICADO_OPTIONS}
                error={errors.implicado?.message}
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
              />
            </div>
          </div>
          {/* FOOTER */}
          <div className="col-span-12 mt-6 flex gap-4">
            <button type="submit" className="btn btn-sm btn-primary w-full md:w-auto">
              Agregar parentesco
            </button>
          </div>
        </form>
        {idDetenido && (
          <div className="mt-4 overflow-x-auto">
            <VristoDataTable<DatosFamiliaresItem>
              rows={datosQuery.data ?? []}
              total={datosQuery.data?.length ?? 0}
              page={page}
              limit={limit}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => setLimit(l)}
              columns={[
                {
                  accessor: 'parentezco',
                  title: 'Parentesco',
                  render: (r) => r.parentezco?.descripcion ?? '',
                },
                { accessor: 'nombres', title: 'Nombres' },
                { accessor: 'paterno', title: 'Ap. Paterno' },
                { accessor: 'materno', title: 'Ap. Materno' },
                { accessor: 'edad', title: 'Edad' },
                { accessor: 'direccion', title: 'Dirección' },
                { accessor: 'telefono', title: 'Teléfono' },
                {
                  accessor: 'vivo',
                  title: 'Vivo',
                  render: (r) => (r.vivo ? 'SI' : 'NO'),
                },
                {
                  accessor: 'implicado',
                  title: 'Implicado',
                  render: (r) => (r.implicado ? 'SI' : 'NO'),
                },
              ]}
              loading={datosQuery.isLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}
