import React from 'react'
import { UsuarioCRUDType } from '../types/usuariosCRUDTypes'
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Icono } from '@/components/Icono'
import {
  TransitionSlide,
  TransitionZoom,
} from '@/components/modales/Animations'
import CustomMensajeEstado from '@/components/estados/CustomMensajeEstado'

interface ModalUsuarioDetalleProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
}

export const ModalUsuarioDetalle = ({
  isOpen,
  onClose,
  usuario,
}: ModalUsuarioDetalleProps) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="sm"
      open={isOpen}
      scroll={'body'}
      onClose={onClose}
      TransitionComponent={fullScreen ? TransitionSlide : TransitionZoom}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontWeight: '600', fontSize: 18 }}>
            Detalles del usuario
          </Typography>
          <IconButton onClick={onClose} color="inherit">
            <Icono color="inherit">close</Icono>
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Grid container spacing={1}>
          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Nombre:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{`${usuario?.persona.nombres} ${usuario?.persona.primerApellido} ${usuario?.persona.segundoApellido}`}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Nro. Documento:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{usuario?.persona.nroDocumento}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>
              Fecha de nacimiento:
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{usuario?.persona.fechaNacimiento}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Usuario:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{usuario?.usuario}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>
              Correo electrónico:
            </Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{usuario?.correoElectronico}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Teléfono:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{usuario?.persona.telefono ?? '-'}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Roles:</Typography>
          </Grid>
          <Grid
            size={8}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              height: '100%',
            }}
          >
            {usuario?.usuarioRol.map((rol, index) => (
              <Chip
                key={index}
                label={rol.rol.rol}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Grid>
          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Estado:</Typography>
          </Grid>
          <Grid size={8}>
            <CustomMensajeEstado
              titulo={usuario?.estado}
              descripcion={usuario?.estado}
              color={
                usuario?.estado == 'ACTIVO'
                  ? 'success'
                  : usuario?.estado == 'INACTIVO'
                    ? 'error'
                    : 'info'
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
