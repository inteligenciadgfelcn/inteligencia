import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { Constantes } from '@/config/Constantes'
import { useAlerts, useConfirmDialog, useSession } from '@/hooks'
import { useAuth } from '@/context/AuthProvider'
import { imprimir } from '@/utils/imprimir'

interface FotoPerfilModalProps {
  open: boolean
  onClose: () => void
}

export const FotoPerfilModal: React.FC<FotoPerfilModalProps> = ({
  open,
  onClose,
}) => {
  const { usuario, actualizarPerfilCompleto } = useAuth()
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    usuario?.urlFoto || null
  )
  const [newFileToUpload, setNewFileToUpload] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { sesionPeticion } = useSession()
  const { Alerta } = useAlerts()
  const { confirm, ConfirmDialog } = useConfirmDialog()

  useEffect(() => {
    setPreviewUrl(usuario?.urlFoto || null)
  }, [usuario?.urlFoto])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setNewFileToUpload(file)
    const localPreviewUrl = URL.createObjectURL(file)
    setPreviewUrl(localPreviewUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: isUploading,
  })

  const handleConfirmUpload = async () => {
    if (!newFileToUpload) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('foto', newFileToUpload)

    try {
      await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/foto`,
        method: 'patch',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      await actualizarPerfilCompleto()

      Alerta({ mensaje: 'Foto actualizada correctamente', variant: 'success' })
      setNewFileToUpload(null)
      onClose()
    } catch (error) {
      imprimir('Error al actualizar la foto:', error)
      Alerta({
        mensaje:
          'Error al actualizar la foto. Por favor, intenta de nuevo más tarde.',
        variant: 'error',
      })
      setPreviewUrl(usuario?.urlFoto || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsUploading(true)
    try {
      await sesionPeticion({
        url: `${Constantes.authUrl}/usuarios/cuenta/foto`,
        method: 'delete',
      })

      await actualizarPerfilCompleto()

      setPreviewUrl(null)
      Alerta({ mensaje: 'Foto eliminada correctamente', variant: 'success' })
      onClose()
    } catch (error) {
      imprimir('Error al eliminar la foto:', error)
      Alerta({
        mensaje:
          'Error al eliminar la foto. Por favor, intenta de nuevo más tarde.',
        variant: 'error',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleEliminarClick = () => {
    confirm({
      texto: '¿Estás seguro de que quieres eliminar la foto?',
      onConfirm: handleConfirmDelete,
    })
  }

  const handleCancel = () => {
    setNewFileToUpload(null)
    setPreviewUrl(usuario?.urlFoto || null)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <ConfirmDialog />
      <DialogTitle>Foto de Perfil</DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed grey',
            borderRadius: 2,
            p: 2,
            mb: 2,
            textAlign: 'center',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            '&:hover': { borderColor: 'primary.main' },
            position: 'relative',
          }}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <CircularProgress />
          ) : isDragActive ? (
            <Typography>Suelta la imagen aquí...</Typography>
          ) : (
            <Typography>
              Arrastra y suelta una imagen aquí, o haz clic para seleccionar una
            </Typography>
          )}
        </Box>
        {previewUrl && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '100%',
              mb: 2,
            }}
          >
            <Image
              src={
                previewUrl.startsWith('blob:')
                  ? previewUrl
                  : `${Constantes.authUrl}${previewUrl}`
              }
              alt="Vista previa"
              layout="fill"
              objectFit="contain"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {newFileToUpload ? (
          <>
            <Button onClick={handleCancel} disabled={isUploading}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmUpload}
              color="primary"
              disabled={isUploading}
            >
              Guardar Cambios
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleEliminarClick}
              color="error"
              disabled={isUploading || !previewUrl}
            >
              Eliminar Foto
            </Button>
            <Button onClick={onClose} disabled={isUploading}>
              Cerrar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
