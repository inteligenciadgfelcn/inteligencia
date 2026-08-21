import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useAlerts } from '@/hooks'

interface DialogLinkActivacionProps {
  isOpen: boolean
  onClose: () => void
  url: string
  titulo?: string
  descripcion?: string
}

export const DialogLinkActivacion: React.FC<DialogLinkActivacionProps> = ({
  isOpen,
  onClose,
  url,
  titulo = 'Link de activación de cuenta',
  descripcion = 'El correo de activación puede tardar o no llegar. Copiá este link y compartíselo al usuario (WhatsApp, teléfono, etc.). Al abrirlo, el usuario define su propia contraseña y la cuenta queda activada.',
}) => {
  const { Alerta } = useAlerts()

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      Alerta({ mensaje: 'Link copiado al portapapeles', variant: 'success' })
    } catch {
      Alerta({
        mensaje: 'No se pudo copiar automáticamente. Seleccioná el link y copiálo manualmente.',
        variant: 'error',
      })
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{descripcion}</DialogContentText>
        <TextField
          fullWidth
          value={url}
          size="small"
          slotProps={{
            htmlInput: {
              readOnly: true,
              onFocus: (e) => e.currentTarget.select(),
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={copiarLink} color="primary">
          Copiar link
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
