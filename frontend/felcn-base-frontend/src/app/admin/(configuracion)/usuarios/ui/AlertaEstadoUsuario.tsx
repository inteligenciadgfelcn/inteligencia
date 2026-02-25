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

interface AlertaEstadoUsuarioProps {
  isOpen: boolean
  onClose: () => void
  usuario: UsuarioCRUDType | null
  onSuccess: () => void
}

export const AlertaEstadoUsuario: React.FC<AlertaEstadoUsuarioProps> = ({
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

  const cambiarEstadoUsuario = async () => {
    if (!usuario) return

    try {
      setLoading(true)
      await delay(1000) // Simular carga
      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/usuarios/${usuario.id}/${
          usuario.estado === 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })
      imprimir(`respuesta estado usuario: ${respuesta}`)
      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })
      onSuccess()
      handleClose()
    } catch (e) {
      imprimir(`Error estado usuario`, e)
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
        {'Confirmar cambio de estado'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`¿Está seguro de ${
            usuario?.estado === 'ACTIVO' ? 'inactivar' : 'activar'
          } el usuario: ${titleCase(usuario?.persona.nombres || '')}?`}
        </DialogContentText>
        <ProgresoLineal mostrar={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={cambiarEstadoUsuario}
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
