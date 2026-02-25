import { Box, Typography } from '@mui/material'
import { forwardRef } from 'react'

const ContenedorPasoInicial = () => {
  return (
    <Box>
      <Typography py={2} variant="h1" textAlign={'center'}>
        👋
      </Typography>
      <Typography py={2} variant="h5" textAlign={'center'}>
        ¡Bienvenido al formulario de registro de datos personales!
      </Typography>

      <Typography py={2} variant="body1" color={'secondary.main'}>
        Por favor, completa los campos requeridos con precisión y confianza, ya
        que nos ayudará a conocerte mejor y brindarte la mejor experiencia
        posible.
      </Typography>
    </Box>
  )
}

export default forwardRef(ContenedorPasoInicial)
