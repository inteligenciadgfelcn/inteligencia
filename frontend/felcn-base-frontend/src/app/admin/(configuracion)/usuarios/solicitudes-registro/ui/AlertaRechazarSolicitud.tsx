import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes } from '@/utils'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'
import { SolicitudRegistroType } from '../types/solicitudesRegistroTypes'

interface Props {
  isOpen: boolean
  onClose: () => void
  solicitud: SolicitudRegistroType | null
  onSuccess: () => void
}

export const AlertaRechazarSolicitud: React.FC<Props> = ({
  isOpen,
  onClose,
  solicitud,
  onSuccess,
}) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)
  const [comentario, setComentario] = useState('')

  const handleClose = () => {
    if (!loading) {
      setComentario('')
      onClose()
    }
  }

  const rechazar = async () => {
    if (!solicitud) return
    try {
      setLoading(true)
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/solicitudes-registro/${solicitud.id}/rechazar`,
        method: 'patch',
        body: { comentario: comentario.trim() || undefined },
      })
      Alerta({ mensaje: InterpreteMensajes(respuesta), variant: 'success' })
      onSuccess()
      handleClose()
    } catch (e) {
      Alerta({ mensaje: InterpreteMensajes(e), variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rechazar solicitud de registro</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          {`¿Está seguro de rechazar la solicitud de ${solicitud?.nombres} ${solicitud?.primerApellido ?? ''}? No se creará ninguna cuenta.`}
        </DialogContentText>
        <TextField
          label="Comentario (opcional)"
          fullWidth
          multiline
          minRows={2}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          disabled={loading}
        />
        <ProgresoLineal mostrar={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={rechazar} color="error" variant="contained" disabled={loading}>
          Rechazar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
