import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Dialog,
  DialogActions,
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
import { formatoFecha } from '@/utils/fechas'
import { SolicitudRegistroType } from '../types/solicitudesRegistroTypes'
import { AlertaRechazarSolicitud } from './AlertaRechazarSolicitud'

interface Props {
  isOpen: boolean
  onClose: () => void
  solicitud: SolicitudRegistroType | null
  onSuccess: () => void
}

const Dato = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Grid>
)

export const ModalSolicitudDetalle: React.FC<Props> = ({
  isOpen,
  onClose,
  solicitud,
  onSuccess,
}) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()
  const [rechazarOpen, setRechazarOpen] = useState(false)

  const irAConfirmar = () => {
    if (!solicitud) return
    router.push(`/admin/usuarios/solicitudes-registro/confirmar/${solicitud.id}`)
  }

  const pendiente = solicitud?.estado === 'PENDIENTE_APROBACION'

  const colorEstado =
    solicitud?.estado === 'APROBADA'
      ? 'success'
      : solicitud?.estado === 'RECHAZADA'
        ? 'error'
        : 'info'

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        maxWidth="sm"
        open={isOpen}
        scroll="body"
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
              Detalle de la solicitud
            </Typography>
            <IconButton onClick={onClose} color="inherit">
              <Icono color="inherit">close</Icono>
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <CustomMensajeEstado
                titulo={solicitud?.estado ?? ''}
                descripcion={solicitud?.estado ?? ''}
                color={colorEstado}
              />
            </Grid>

            <Dato
              label="Nombres"
              value={`${solicitud?.nombres ?? ''} ${solicitud?.primerApellido ?? ''} ${solicitud?.segundoApellido ?? ''}`}
            />
            <Dato label="Nro. Documento" value={solicitud?.nroDocumento} />
            <Dato
              label="Fecha de nacimiento"
              value={
                solicitud?.fechaNacimiento
                  ? formatoFecha(solicitud.fechaNacimiento, 'DD/MM/YYYY')
                  : undefined
              }
            />
            <Dato label="Correo electrónico" value={solicitud?.correoElectronico} />
            <Dato label="Teléfono" value={solicitud?.telefono} />
            <Dato
              label="Grado"
              value={
                solicitud?.grado
                  ? `${solicitud.grado.abreviatura} — ${solicitud.grado.descripcion}`
                  : solicitud?.idGrado
              }
            />
            <Dato label="Número de Pase" value={solicitud?.numeroPase} />
            <Dato
              label="Fecha de solicitud"
              value={
                solicitud?.fechaCreacion
                  ? formatoFecha(solicitud.fechaCreacion, 'DD/MM/YYYY HH:mm')
                  : undefined
              }
            />

            {!pendiente && (
              <>
                <Dato
                  label="Fecha de resolución"
                  value={
                    solicitud?.fechaResolucion
                      ? formatoFecha(solicitud.fechaResolucion, 'DD/MM/YYYY HH:mm')
                      : undefined
                  }
                />
                {solicitud?.comentarioRechazo && (
                  <Dato label="Comentario" value={solicitud.comentarioRechazo} />
                )}
              </>
            )}
          </Grid>
        </DialogContent>
        {pendiente && (
          <DialogActions>
            <Button color="error" onClick={() => setRechazarOpen(true)}>
              Rechazar
            </Button>
            <Button variant="contained" onClick={irAConfirmar}>
              Aprobar
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <AlertaRechazarSolicitud
        isOpen={rechazarOpen}
        onClose={() => setRechazarOpen(false)}
        solicitud={solicitud}
        onSuccess={() => {
          onSuccess()
          onClose()
        }}
      />
    </>
  )
}
