import {
  InputLabel,
  TextField,
  IconButton,
  Select,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  Box,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'

import React, { useEffect, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'

export interface FiltroType {
  palabraClave: string
  fechaInicial: Date
  fechaFinal: Date
  categorias: string[]
}

export interface FiltrosDatatableType {
  titulo?: string
  categoriasDisponibles: string[]
  filtroFechaInicial?: Date
  filtroFechaFinal?: Date
  filtroCategorias?: string[]
  filtroPalabraClave?: string
  accionCorrecta: (filtros: FiltroType) => void
}

export const FiltrosDatatable: React.FC<FiltrosDatatableType> = ({
  titulo,
  categoriasDisponibles,
  filtroCategorias,
  filtroFechaInicial,
  filtroFechaFinal,
  filtroPalabraClave,
  accionCorrecta,
}: FiltrosDatatableType) => {
  const { control, watch, register, setValue } = useForm<FiltroType>({
    defaultValues: {
      palabraClave: filtroPalabraClave,
      categorias: filtroCategorias,
      fechaInicial: filtroFechaInicial,
      fechaFinal: filtroFechaFinal,
    },
  })

  const watchedFields = useWatch({
    control,
    name: ['palabraClave', 'categorias', 'fechaInicial', 'fechaFinal'],
  })

  const debouncedAccionCorrecta = useDebouncedCallback(
    (filtros: FiltroType) => {
      accionCorrecta(filtros)
    },
    1000
  )

  const actualizacionFiltros = useCallback(() => {
    debouncedAccionCorrecta({
      palabraClave: watchedFields[0],
      categorias: watchedFields[1],
      fechaInicial: watchedFields[2],
      fechaFinal: watchedFields[3],
    })
  }, [debouncedAccionCorrecta, watchedFields])

  useEffect(() => {
    actualizacionFiltros()
  }, [actualizacionFiltros])

  // const opcionesCategorias = useMemo(
  //   () =>
  //     categoriasDisponibles.map((categoria, index) => ({
  //       id: index.toString(),
  //       value: categoria,
  //       label: categoria,
  //     })),
  //   [categoriasDisponibles]
  // )

  return (
    <Box>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant={'h5'} sx={{ fontWeight: '600', pl: 1 }}>
          {titulo}
        </Typography>
      </Grid>
      <Box sx={{ pl: 1, pr: 1, pt: 1 }}>
        <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 3,
            }}
          >
            <InputLabel
              htmlFor={'palabraClave'}
              sx={{ color: 'text.primary', fontWeight: '500' }}
            >
              Buscar por nombre
            </InputLabel>
            <TextField
              {...register('palabraClave')}
              id="palabraClave"
              fullWidth
              sx={{
                bgColor: 'background.paper'
              }}
              slotProps={{
                input: {
                  endAdornment: watch('palabraClave') && (
                    <IconButton
                      size="small"
                      color={'primary'}
                      onClick={() => {
                        setValue('palabraClave', '')
                      }}
                    >
                      <Icono color={'primary'}>clear</Icono>
                    </IconButton>
                  ),
                },
              }}
            />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 3,
            }}
          >
            <InputLabel
              htmlFor={'fechaInicial'}
              sx={{ color: 'text.primary', fontWeight: '500' }}
            >
              Fecha inicial
            </InputLabel>
            <TextField
              {...register('fechaInicial')}
              id="fechaInicial"
              fullWidth
              sx={{
                bgColor: 'background.paper'
              }}
              type={'date'}
            />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 3,
            }}
          >
            <InputLabel
              htmlFor={'fechaFinal'}
              sx={{ color: 'text.primary', fontWeight: '500' }}
            >
              Fecha final
            </InputLabel>
            <TextField
              {...register('fechaFinal')}
              id="fechaFinal"
              fullWidth
              sx={{
                bgColor: 'background.paper'
              }}
              type={'date'}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 12,
              md: 3,
            }}
          >
            <InputLabel
              htmlFor={'categoria'}
              sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
            >
              Categorías
            </InputLabel>
            <Select
              {...register('categorias')}
              id="categoria"
              fullWidth
              multiple
              size="small"
              value={watch('categorias')}
              onChange={(event) => {
                const value = event.target.value as string[]
                setValue('categorias', value, { shouldValidate: true })
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((id) => {
                    const cat = categoriasDisponibles.find((r) => r === id)
                    return cat ? (
                      <Chip key={id} label={cat} size="small" />
                    ) : null
                  })}
                </Box>
              )}
            >
              {categoriasDisponibles.map((categoria) => (
                <MenuItem key={categoria} value={categoria}>
                  <Checkbox checked={watch('categorias').includes(categoria)} />
                  <ListItemText primary={categoria} />
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
