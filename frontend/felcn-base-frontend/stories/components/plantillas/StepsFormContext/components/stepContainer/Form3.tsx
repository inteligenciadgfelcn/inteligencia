import { Ref, forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Box, InputLabel, TextField } from '@mui/material'
import { useFormState } from '../FormContext'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export interface Form3Ref {
  validar: () => Promise<void>
}

interface PropsComponente {
  accionSiguiente: () => Promise<void>
}

const formSchema = z.object({
  zona: z.string().min(1, { message: 'Este campo es requerido' }),
  calle: z.string().min(1, { message: 'Este campo es requerido' }),
  nroDomicilio: z.string().min(1, { message: 'Este campo es requerido' }),
})
type FormValues = z.infer<typeof formSchema>

const Form3 = (props: PropsComponente, ref: Ref<unknown | undefined>) => {
  const { setFormData, formData } = useFormState()
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }))
    await props.accionSiguiente()
  }

  useImperativeHandle(
    ref,
    (): Form3Ref => ({
      validar: () => {
        return handleSubmit(onSubmit)()
      },
    })
  )

  return (
    <Box display={'flex'} flexDirection={'column'} gap={1}>
      <Box>
        <InputLabel
          htmlFor={'zona'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Zona
        </InputLabel>
        <TextField
          {...register('zona')}
          id="zona"
          fullWidth
          error={!!errors.zona}
          helperText={errors.zona?.message}
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'calle'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Calle
        </InputLabel>
        <TextField
          {...register('calle')}
          id="calle"
          fullWidth
          error={!!errors.calle}
          helperText={errors.calle?.message}
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'nroDomicilio'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Nro. de Domicilio
        </InputLabel>
        <TextField
          {...register('nroDomicilio')}
          id="nroDomicilio"
          fullWidth
          error={!!errors.nroDomicilio}
          helperText={errors.nroDomicilio?.message}
        />
      </Box>
    </Box>
  )
}

export default forwardRef(Form3)
