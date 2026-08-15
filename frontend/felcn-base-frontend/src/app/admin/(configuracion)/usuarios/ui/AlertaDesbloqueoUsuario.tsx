import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes, delay, titleCase } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { UsuarioCRUDType } from '@/app/admin/(configuracion)/usuarios/types/usuariosCRUDTypes'
import {
  TransitionSlide,
  TransitionZoom,
} from '@/components/modales/Animations'
import ProgresoLineal from '@/components/progreso/ProgresoLineal'

interface AlertaDesbloqueoUsuarioProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
  onSuccess: () => void
}

export const AlertaDesbloqueoUsuario: React.FC<AlertaDesbloqueoUsuarioProps> = ({
  isOpen,
  onClose,
  usuario,
  onSuccess,
}) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const desbloquear = async () => {
    if (!usuario) return

    try {
      setLoading(true)
      await delay(1000) // Simular carga
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/${usuario.id}/desbloqueo`,
        method: 'patch',
      })
      imprimir(`respuesta desbloqueo: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      onSuccess()
      handleClose()
    } catch (e) {
      imprimir(`Error al desbloquear usuario`, e)
      Alerta({ mensaje: `${InterpreteMensajes(e)}`, variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={fullScreen ? TransitionSlide : TransitionZoom}
      fullScreen={fullScreen}
    >
      <DialogTitle id="alert-dialog-title">
        {'Confirmar desbloqueo de cuenta'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`¿Está seguro de desbloquear la cuenta del usuario: ${titleCase(usuario?.persona.nombres || '')}? Podrá iniciar sesión de inmediato sin esperar ni depender de su correo.`}
        </DialogContentText>
        <ProgresoLineal mostrar={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={desbloquear}
          color="primary"
          autoFocus
          disabled={loading}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
