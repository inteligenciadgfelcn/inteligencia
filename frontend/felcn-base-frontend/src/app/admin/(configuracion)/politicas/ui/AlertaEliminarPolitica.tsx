'use client'

import { useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes, delay } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { PoliticaCRUDType } from '@/app/admin/(configuracion)/politicas/types/PoliticasCRUDTypes'

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

  if (!isOpen) return null

  const eliminarPolitica = async () => {

    if (!politica || loading) return

    try {
      setLoading(true)

      await delay(800)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/politicas`,
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
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">

      <div className="panel w-full max-w-lg p-5 animate__animated animate__zoomIn">

        {/* HEADER */}
        <h5 className="mb-3 text-lg font-semibold">
          Confirmar eliminación
        </h5>

        {/* BODY */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Está seguro de eliminar la política{' '}
          <span className="font-semibold">
            {politica?.app}-{politica?.objeto}-{politica?.sujeto}-{politica?.accion}
          </span>
          ?
        </p>

        {/* LOADING */}
        {loading && (
          <div className="mt-4">
            <div className="h-1 w-full rounded bg-gray-200 overflow-hidden">
              <div className="h-full bg-primary animate-pulse" />
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-6 flex justify-end gap-3">

          <button
            className="btn btn-outline-primary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={eliminarPolitica}
            disabled={loading}
          >
            Eliminar
          </button>

        </div>

      </div>
    </div>
  )
}
