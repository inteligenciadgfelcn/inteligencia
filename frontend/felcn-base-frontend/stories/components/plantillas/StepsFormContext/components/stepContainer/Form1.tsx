import { Ref, forwardRef, useImperativeHandle } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Box, InputLabel, TextField } from '@mui/material'
import { useFormState } from '../FormContext'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export interface Form1Ref {
  validar: () => Promise<void>
}

interface PropsComponente {
  accionSiguiente: () => Promise<void>
}

const formSchema = z.object({
  nombre: z.string().min(1, { message: 'Este campo es requerido' }),
  primerApellido: z.string().min(1, { message: 'Este campo es requerido' }),
  segundoApellido: z.string().min(1, { message: 'Este campo es requerido' }),
  nroDocumento: z.string().min(1, { message: 'Este campo es requerido' }),
})

type FormValues = z.infer<typeof formSchema>

const Form1 = (props: PropsComponente, ref: Ref<unknown | undefined>) => {
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
    (): Form1Ref => ({
      validar: () => {
        return handleSubmit(onSubmit)()
      },
    })
  )

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Box>
        <InputLabel
          htmlFor={'nombre'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Nombre
        </InputLabel>
        <TextField
          {...register('nombre')}
          id="nombre"
          fullWidth
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />
      </Box>
      
      <Box>
        <InputLabel
          htmlFor={'primerApellido'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Primer Apellido
        </InputLabel>
        <TextField
          {...register('primerApellido')}
          id="primerApellido"
          fullWidth
          error={!!errors.primerApellido}
          helperText={errors.primerApellido?.message}
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'segundoApellido'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Segundo Apellido
        </InputLabel>
        <TextField
          {...register('segundoApellido')}
          id="primerApellido"
          fullWidth
          error={!!errors.segundoApellido}
          helperText={errors.segundoApellido?.message}
        />
      </Box>

      <Box>
        <InputLabel
          htmlFor={'nroDocumento'}
          sx={{ color: 'text.primary', fontWeight: '500' }}
        >
          Nro. de Documento C.I.
        </InputLabel>
        <TextField
          {...register('nroDocumento')}
          id="nroDocumento"
          fullWidth
          error={!!errors.nroDocumento}
          helperText={errors.nroDocumento?.message}
        />
      </Box>
    </Box>
  )
}

export default forwardRef(Form1)
