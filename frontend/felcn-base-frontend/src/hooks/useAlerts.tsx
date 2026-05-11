import { useCallback } from 'react'
import { SnackbarOrigin, useSnackbar, VariantType } from 'notistack'
import { IconButton } from '@mui/material'
import { Icono } from '@/components/Icono'

export interface AlertType {
  mensaje: string
  variant?: VariantType
  anchorOrigin?: SnackbarOrigin
}

export const useAlerts = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const Alerta = useCallback(
    ({
      mensaje,
      variant = 'info',
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
      },
    }: AlertType) => {
      enqueueSnackbar(mensaje, {
        variant,
        anchorOrigin,
        action: (key) => (
          <IconButton
            color="inherit"
            onClick={() => {
              closeSnackbar(key)
            }}
          >
            <Icono color={'inherit'}>close</Icono>
          </IconButton>
        ),
      })
    },
    [enqueueSnackbar, closeSnackbar]
  )

  return { Alerta }
}
