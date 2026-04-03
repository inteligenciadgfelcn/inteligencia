import InputWithPrefix from '@/components/form/FormInputWithPrefix'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  apPaterno: z.string().min(1, 'El apellido paterno es requerido'),
  apMaterno: z.string().min(1, 'El apellido materno es requerido'),
  apEsposo: z.string().min(1, 'El apellido de esposo es requerido'),
})

type FormValues = z.infer<typeof formSchema>

export function FormNombresSupuestos() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const onSubmitSupuestos = (values: FormValues) => {}

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
          <div className="col-span-12 mt-6 flex gap-4">
            <button type="submit" className="btn btn-sm btn-primary col-span-2">
              Agregar nombres supuestos
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
