'use client'

import { useForm } from 'react-hook-form'

import { AsyncSearchSelect } from '@/components/form/FormAsyncSelect'
import InputWithPrefix from '@/components/form/FormInputWithPrefix'

type OptionBase = {
  id: number
  descripcion: string
}

type ParentescoFormValues = {
  nombres: string
  apPaterno: string
  apMaterno: string
  edad: string
  direccion: string
  telefono: string
  estado: { label: string; value: number; original: OptionBase } | null
  implicado: { label: string; value: number; original: OptionBase } | null
}

type NombresSupuestosFormValues = {
  nombresSupuestos: string
  apPaternoSupuestos: string
  apMaternoSupuestos: string
  apEsposoSupuestos: string
}

const ESTADO_OPTIONS: OptionBase[] = [
  { id: 1, descripcion: 'PADRE' },
  { id: 2, descripcion: 'MADRE' },
  { id: 3, descripcion: 'HIJO/A' },
  { id: 4, descripcion: 'HERMANO/A' },
  { id: 5, descripcion: 'OTRO' },
]

const IMPLICADO_OPTIONS: OptionBase[] = [
  { id: 1, descripcion: 'SI' },
  { id: 2, descripcion: 'NO' },
]

export function FormParentesco() {
  const {
    register: registerParentesco,
    control: controlParentezco,
    handleSubmit: handleSubmitParentesco,
  } = useForm<ParentescoFormValues>({
    defaultValues: {
      estado: null,
      implicado: null,
    },
  })

  const { register: registerSupuestos, handleSubmit: handleSubmitSupuestos } =
    useForm<NombresSupuestosFormValues>()

  const onSubmitParentezco = (_values: ParentescoFormValues) => {
    // Placeholder submit handler until endpoint integration is defined.
  }

  const onSubmitSupuestos = (_values: NombresSupuestosFormValues) => {
    // Placeholder submit handler until endpoint integration is defined.
  }

  return (
    <div className="space-y-5">
      <div className="panel p-4">
        <h2 className="text-lg font-semibold text-primary mb-4">Parentescos</h2>

        <form onSubmit={handleSubmitParentesco(onSubmitParentezco)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <InputWithPrefix
                name="nombres"
                prefix="Nombre(s)"
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="apPaterno"
                prefix="Ap. Paterno"
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="apMaterno"
                prefix="Ap. Materno"
                register={registerParentesco}
              />
            </div>

            <div className="md:col-span-4">
              <InputWithPrefix
                name="edad"
                prefix="Edad"
                register={registerParentesco}
                onlyNumbers
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="direccion"
                prefix="Direccion"
                register={registerParentesco}
              />
            </div>
            <div className="md:col-span-4">
              <InputWithPrefix
                name="telefono"
                prefix="Telefono"
                register={registerParentesco}
                onlyNumbers
              />
            </div>

            <div className="md:col-span-6">
              <AsyncSearchSelect<OptionBase>
                name="estado"
                control={controlParentezco}
                prefix="Estado"
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
                mapOption={(item) => ({
                  label: item.descripcion,
                  value: item.id,
                  original: item,
                })}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="panel p-4">
        <h2 className="text-lg font-semibold text-primary mb-4">
          Nombres Supuestos
        </h2>

        <form onSubmit={handleSubmitSupuestos(onSubmitSupuestos)}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <InputWithPrefix
                name="nombresSupuestos"
                prefix="Nombre(s)"
                register={registerSupuestos}
              />
            </div>
            <div className="md:col-span-3">
              <InputWithPrefix
                name="apPaternoSupuestos"
                prefix="Ap. Paterno"
                register={registerSupuestos}
              />
            </div>
            <div className="md:col-span-3">
              <InputWithPrefix
                name="apMaternoSupuestos"
                prefix="Ap. Materno"
                register={registerSupuestos}
              />
            </div>
            <div className="md:col-span-3">
              <InputWithPrefix
                name="apEsposoSupuestos"
                prefix="Ap. Esposo"
                register={registerSupuestos}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
