'use client'

import { useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes, delay } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { PoliticaCRUDType } from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'
import { AlertDialog } from '@/components/modales/AlertDialog'
import { Button } from '@/components/ui/Button'

interface AlertaEliminarPoliticaProps {
  isOpen: boolean
  onClose: () => void
  politica: PoliticaCRUDType | null
  onSuccess: () => void
}

export const AlertaEliminarPolitica = ({
  isOpen,
  onClose,
  politica,
  onSuccess,
}: AlertaEliminarPoliticaProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)

  const eliminarPolitica = async () => {
    if (!politica || loading) return

    try {
      setLoading(true)

      await delay(800)

      const respuesta = await sesionPeticion({
        url: `${Constantes.authUrl}/autorizacion/politicas`,
        method: 'delete',
        params: {
          sujeto: politica.sujeto,
          objeto: politica.objeto,
          accion: politica.accion,
          app: politica.app,
        },
      })

      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error al eliminar política', e)
      Alerta({
        mensaje: `${InterpreteMensajes(e)}`,
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      titulo="Confirmar eliminación"
      texto={`¿Está seguro de eliminar la política ${politica?.app}-${politica?.objeto}-${politica?.sujeto}-${politica?.accion}?`}
    >
      <Button
        variant="outline-secondary"
        onClick={onClose}
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button
        variant="danger"
        onClick={() => void eliminarPolitica()}
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Eliminar'}
      </Button>
    </AlertDialog>
  )
}
