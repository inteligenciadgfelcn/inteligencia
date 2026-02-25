import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useDebouncedCallback } from 'use-debounce'
import { RolType } from '../types/usuariosCRUDTypes'
import { Icono } from '@/components/Icono'

export interface FiltroType {
  usuario: string
  roles: string[]
}

export interface FiltroModalUsuarioType {
  rolesDisponibles: RolType[]
  filtroRoles: string[]
  filtroUsuario: string
  accionCorrecta: (filtros: FiltroType) => void
  accionCerrar: () => void
}

export const FiltroUsuarios: React.FC<FiltroModalUsuarioType> = ({
  rolesDisponibles,
  filtroRoles,
  filtroUsuario,
  accionCorrecta,
}: FiltroModalUsuarioType) => {
  const { watch, setValue, register } = useForm<FiltroType>({
    defaultValues: {
      usuario: filtroUsuario,
      roles: filtroRoles,
    },
  })

  const debounced = useDebouncedCallback(
    // function
    (filtros: FiltroType) => {
      accionCorrecta(filtros)
    },
    1000
  )

  const actualizacionFiltros = (filtros: FiltroType) => {
    debounced(filtros)
  }

  useEffect(() => {
    actualizacionFiltros({
      usuario: watch('usuario'),
      roles: watch('roles'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('roles'), watch('usuario')])

  return (
    <Box sx={{ py: 1 }}>
      <Grid container direction="row" spacing={{ xs: 2, sm: 1, md: 2 }}>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 4,
          }}
        >
          <InputLabel
            htmlFor={'buscar'}
            sx={{ color: 'text.primary', fontWeight: '500' }}
          >
            Nombre
          </InputLabel>
          <TextField
            id="nombre"
            fullWidth
            {...register('usuario')}
            sx={{
              bgcolor: 'background.paper',
            }}
            slotProps={{
              input: {
                endAdornment: watch('usuario') && (
                  <IconButton
                    size="small"
                    color={'primary'}
                    onClick={() => {
                      setValue('usuario', '')
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
            xs: 12,
            sm: 12,
            md: 4,
          }}
        >
          <InputLabel
            htmlFor={'apps'}
            sx={{ color: 'text.primary', fontWeight: '500', mb: 1 }}
          >
            Roles
          </InputLabel>
          <Select
            {...register('roles')}
            id="roles"
            fullWidth
            multiple
            size="small"
            sx={{
              bgcolor: 'background.paper',
            }}
            value={watch('roles')}
            onChange={(event) => {
              const value = event.target.value as string[]
              setValue('roles', value, { shouldValidate: true })
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const role = rolesDisponibles.find((r) => r.id === id)
                  return role ? (
                    <Chip key={id} label={role.nombre} size="small" />
                  ) : null
                })}
              </Box>
            )}
          >
            {rolesDisponibles.map((rol) => (
              <MenuItem key={rol.id} value={rol.id}>
                <Checkbox checked={watch('roles').includes(rol.id)} />
                <ListItemText primary={rol.nombre} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </Box>
  )
}
