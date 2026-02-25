import React, { useEffect } from 'react'
import { Box, IconButton, InputLabel, TextField } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { Icono } from '@/components/Icono'

export interface FiltroType {
  rol: string
}

export interface FiltroRolProps {
  filtroRol: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroRol: React.FC<FiltroRolProps> = ({
  filtroRol,
  accionCorrecta,
}) => {
  const { watch, setValue, register } = useForm<FiltroType>({
    defaultValues: {
      rol: filtroRol,
    },
  })

  const debounced = useDebouncedCallback((filtros: FiltroType) => {
    accionCorrecta(filtros)
  }, 1000)

  useEffect(() => {
    debounced({ rol: watch('rol') || '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('rol'), debounced])

  return (
    <Box sx={{ py: 1 }}>
      <Grid container direction="row" spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InputLabel
            htmlFor={'buscar'}
            sx={{ color: 'text.primary', fontWeight: '500' }}
          >
            Buscar rol
          </InputLabel>
          <TextField
            id="filtroRol"
            fullWidth
            {...register('rol')}
            sx={{
              bgcolor: 'background.paper',
            }}
            slotProps={{
              input: {
                endAdornment: watch('rol') && (
                  <IconButton
                    size="small"
                    color={'primary'}
                    onClick={() => {
                      setValue('rol', '')
                    }}
                  >
                    <Icono color={'primary'}>clear</Icono>
                  </IconButton>
                ),
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
