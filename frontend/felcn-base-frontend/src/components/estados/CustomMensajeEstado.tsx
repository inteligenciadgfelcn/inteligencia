import React from 'react'
import { Box, Tooltip, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'

export interface MensajeEstadoProps {
  titulo?: string
  descripcion?: string
  fontSize?: number
  letterSpacing?: number
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
  opacidadFondo?: number
  customColor?: string
}

const coloresFondoClaro = {
  primary: '#cce1df',
  secondary: '#dbe0df',
  info: '#EBF5FF',
  warning: '#FEF7E6',
  error: '#FDF4F6',
  success: '#EAF8F4',
  inherit: '#f1d1d1',
}

const coloresFondoOscuro = {
  primary: '#001513',
  secondary: '#0f1413',
  info: '#1B2A43',
  warning: '#2f1600',
  error: '#392127',
  success: '#283b39',
  inherit: '#f1d1d1',
}

const coloresTextoClaro = {
  primary: '#cce1df',
  secondary: '#555F71',
  info: '#0288d1',
  warning: '#FFAF01',
  error: '#DE486C',
  success: '#30B082',
  inherit: '#555F71',
}

const coloresTextoOscuro = {
  primary: '#001513',
  secondary: '#555F71',
  info: '#8DC7FF',
  warning: '#ed6c02',
  error: '#FF7F8D',
  success: '#a1f7cf',
  inherit: '#555F71',
}

const CustomMensajeEstado: React.FC<MensajeEstadoProps> = ({
  color = 'error',
  titulo = '',
  descripcion = '',
  fontSize = 12,
  letterSpacing = 0,
  opacidadFondo = 1,
}) => {
  const theme = useTheme()
  const effectiveMode = theme.palette.mode

  const bgColor =
    effectiveMode === 'dark'
      ? coloresFondoOscuro[color]
      : coloresFondoClaro[color]
  const textColor =
    effectiveMode === 'dark'
      ? coloresTextoOscuro[color]
      : coloresTextoClaro[color]

  return (
    <Tooltip title={descripcion}>
      <Box
        sx={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: alpha(bgColor, opacidadFondo),
          textAlign: 'center',
          borderRadius: 2,
          padding: '2px 8px',
          border: 0,
          borderColor: textColor,
          minWidth: '60px',
          maxHeight: '30px',
        }}
      >
        <Box
          component={'span'}
          sx={{
            color: textColor,
            overflow: 'hidden',
            fontWeight: '700',
            fontSize,
            opacity: 1,
            letterSpacing,
          }}
        >
          {titulo}
        </Box>
      </Box>
    </Tooltip>
  )
}

export default CustomMensajeEstado
