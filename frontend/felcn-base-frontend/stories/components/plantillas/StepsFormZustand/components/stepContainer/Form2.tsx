import { Ref, forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Box, InputLabel, TextField } from '@mui/material'
import { useFormStepStore } from '../StepsForm-store'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export interface Form2Ref {
  validar: () => Promise<void>
}

interface PropsComponente {
  accionSiguiente: () => Promise<void>
}

const formSchema = z.object({
  correo: z
    .string()
    .min(1, { message: 'Este campo es requerido' })
    .email({ message: 'Debe ingresar un correo electrónico válido' }),
  nroCelular: z.string().min(1, { message: 'Este campo es requerido' }),
  nroCelularAlternativo: z
    .string()
    .min(1, { message: 'Este campo es requerido' }),
})

type FormValues = z.infer<typeof formSchema>

const Form2 = (props: PropsComponente, ref: Ref<unknown | undefined>) => {
  const formData = useFormStepStore((state) => state.formData)
  const setFormData = useFormStepStore((state) => state.setFormData)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormData(data)
    await props.accionSiguiente()
  }

  useImperativeHandle(
    ref,
    (): Form2Ref => ({
      validar: () => {
        return handleSubmit(onSubmit)()
      },
    })
  )

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Box>
        <InputLabel
          htmlFor={'correo'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Correo
        </InputLabel>
        <TextField
          {...register('correo')}
          id="correo"
          fullWidth
          error={!!errors.correo}
          helperText={errors.correo?.message}
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'nroCelular'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Nro. de Celular
        </InputLabel>
        <TextField
          {...register('nroCelular')}
          id="nroCelular"
          fullWidth
          error={!!errors.nroCelular}
          helperText={errors.nroCelular?.message}
          type="number"
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'nroCelularAlternativo'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Nro. de celular alternativo
        </InputLabel>
        <TextField
          {...register('nroCelularAlternativo')}
          id="nroCelularAlternativo"
          fullWidth
          error={!!errors.nroCelularAlternativo}
          helperText={errors.nroCelularAlternativo?.message}
          type="number"
        />
      </Box>
    </Box>
  )
}

export default forwardRef(Form2)
