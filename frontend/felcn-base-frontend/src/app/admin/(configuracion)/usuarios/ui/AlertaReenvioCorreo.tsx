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

interface AlertaReenvioCorreoProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
  onSuccess: () => void
}

export const AlertaReenvioCorreo: React.FC<AlertaReenvioCorreoProps> = ({
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

  const reenviarCorreo = async () => {
    if (!usuario) return

    try {
      setLoading(true)
      await delay(1000) // Simular carga
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/usuarios/${usuario.id}/reenviar`,
        method: 'patch',
      })
      imprimir(`respuesta reenviar correo: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      onSuccess()
      handleClose()
    } catch (e) {
      imprimir(`Error al reenviar correo`, e)
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
        {'Confirmar reenvío de correo de activación'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`¿Está seguro de reenviar el correo de activación al usuario: ${titleCase(usuario?.persona.nombres || '')}?`}
        </DialogContentText>
        <ProgresoLineal mostrar={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={reenviarCorreo}
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
