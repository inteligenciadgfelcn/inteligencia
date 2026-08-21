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
import { DialogLinkActivacion } from './DialogLinkActivacion'

interface AlertaRestablecerContrasenaProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
  onSuccess: () => void
}

export const AlertaRestablecerContrasena: React.FC<
  AlertaRestablecerContrasenaProps
> = ({ isOpen, onClose, usuario, onSuccess }) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)
  const [urlRecuperacion, setUrlRecuperacion] = useState<string | null>(null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const restablecerContrasena = async () => {
    if (!usuario) return

    try {
      setLoading(true)
      await delay(1000) // Simular carga
      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/${usuario.id}/restauracion`,
        method: 'patch',
      })
      imprimir(`respuesta restablecer contraseña: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      onSuccess()
      if (respuesta?.datos?.urlRecuperacion) {
        setUrlRecuperacion(respuesta.datos.urlRecuperacion)
      } else {
        handleClose()
      }
    } catch (e) {
      imprimir(`Error al restablecer contraseña`, e)
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

  const handleCloseLinkRecuperacion = () => {
    setUrlRecuperacion(null)
    onClose()
  }

  return (
    <>
      <Dialog
        open={isOpen && !urlRecuperacion}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={fullScreen ? TransitionSlide : TransitionZoom}
        fullScreen={fullScreen}
      >
        <DialogTitle id="alert-dialog-title">
          {'Confirmar restablecimiento de contraseña'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`¿Está seguro de restablecer la contraseña del usuario: ${titleCase(usuario?.persona.nombres || '')}? Se le va a enviar un enlace para que defina una contraseña nueva.`}
          </DialogContentText>
          <ProgresoLineal mostrar={loading} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={restablecerContrasena}
            color="primary"
            autoFocus
            disabled={loading}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <DialogLinkActivacion
        isOpen={!!urlRecuperacion}
        onClose={handleCloseLinkRecuperacion}
        url={urlRecuperacion ?? ''}
        titulo="Link de recuperación de contraseña"
        descripcion="El correo puede tardar o no llegar. Copiá este link y compartíselo al usuario (WhatsApp, teléfono, etc.). Al abrirlo, el usuario define su nueva contraseña."
      />
    </>
  )
}
