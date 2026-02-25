import React from 'react'
import { Tooltip, useTheme } from '@mui/material'
import Box from '@mui/material/Box'

export type ColorType =
  | 'disabled'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

export interface CustomMensajeEstadoProps {
  titulo?: string | React.ReactNode
  descripcion?: string
  fontSize?: number
  letterSpacing?: number
  color?: ColorType
  opacidadFondo?: number
  customColor?: string
  width?: number
  onClick?: () => void
}

const coloresTextoClaro: Record<ColorType, string> = {
  primary: '#3d00ba',
  secondary: '#555F71',
  info: '#0288d1',
  warning: '#f1c21b',
  error: '#da1e28',
  success: '#24A148',
  inherit: '#555F71',
  disabled: '#fff',
}

const coloresTextoOscuro: Record<ColorType, string> = {
  primary: '#CABEFF',
  secondary: '#555F71',
  info: '#8DC7FF',
  warning: '#ff832b',
  error: '#fa4d56',
  success: '#42be65',
  inherit: '#555F71',
  disabled: '#fff',
}

const CustomMensajeEstado: React.FC<CustomMensajeEstadoProps> = ({
  color = 'error',
  titulo = '',
  descripcion = '',
  fontSize = 12,
  onClick,
}) => {
  const theme = useTheme()
  const effectiveMode = theme.palette.mode

  const colorTexto =
    effectiveMode === 'dark'
      ? coloresTextoOscuro[color]
      : coloresTextoClaro[color]

  return (
    <Tooltip title={descripcion}>
      <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
        <Box
          sx={{
            height: 10,
            width: 10,
            bgcolor: colorTexto,
            borderRadius: 5,
            display: 'inline-block',
          }}
        />
        <Box width={'5px'} />
        <Box
          component={'span'}
          onClick={onClick}
          sx={{
            color: 'text.primary',
            alignItems: 'flex-end',
            overflow: 'hidden',
            fontWeight: '600',
            fontSize: fontSize,
            whiteSpace: 'nowrap',
            opacity: 1,
            cursor: onClick ? 'pointer' : 'default',
          }}
        >
          {titulo}
        </Box>
      </Box>
    </Tooltip>
  )
}

export default CustomMensajeEstado
