'use client'

import { useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes, delay, titleCase } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { CasoServicioTypeCRUD } from '@/app/admin/(configuracion)/casos_servicio/types/CasoServicioType'

interface AlertaEstadoCasoServicioProps {
  isOpen: boolean
  onClose: () => void
  casoServicio: CasoServicioTypeCRUD | null
  onSuccess: () => void
}

export const AlertaEstadoCasoServicio = ({
  isOpen,
  onClose,
  casoServicio,
  onSuccess,
}: AlertaEstadoCasoServicioProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const cambiarEstadoModulo = async () => {
    if (!casoServicio) return

    try {
      setLoading(true)
      await delay(800)

      const respuesta = await sesionPeticion({
        url: `${Constantes.baseUrl}/casos_servicio/${casoServicio.id}/${
          casoServicio.estado === 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })

      Alerta({
        mensaje: InterpreteMensajes(respuesta),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error estado módulo', e)
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
        <div className="mb-3">
          <h5 className="text-lg font-semibold">Confirmar cambio de estado</h5>
        </div>

        {/* BODY */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ¿Está seguro de{' '}
          <span className="font-semibold">
            {casoServicio?.estado === 'ACTIVO' ? 'inactivar' : 'activar'}
          </span>{' '}
          el caso de servicio:{' '}
          <span className="font-semibold">
            {titleCase(casoServicio?.nroRegistro || '')}
          </span>
          ?
        </div>

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
            onClick={cambiarEstadoModulo}
            disabled={loading}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
