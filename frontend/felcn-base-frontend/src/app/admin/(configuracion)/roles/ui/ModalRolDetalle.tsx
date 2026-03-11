import React from 'react'
import {
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
import { RolCRUDType } from '../types/rolCRUDType'

interface ModalRolDetalleProps {
  isOpen: boolean
  onClose: () => void
  rol: RolCRUDType | null
}

export const ModalRolDetalle = ({
  isOpen,
  onClose,
  rol,
}: ModalRolDetalleProps) => {
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
            Detalles del rol
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
            <Typography>{rol?.nombre}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Descripción:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{rol?.descripcion}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Rol:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{rol?.rol}</Typography>
          </Grid>

          <Grid size={4}>
            <Typography sx={{ fontWeight: '700' }}>Estado:</Typography>
          </Grid>
          <Grid size={8}>
            <Typography>{rol?.estado}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
