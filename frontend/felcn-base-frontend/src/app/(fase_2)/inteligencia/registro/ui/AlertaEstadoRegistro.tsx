'use client'

import { useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { AsignacionTable } from '../types/asignacion.table'
import { titleCase } from '@/utils'

interface AlertaEstadoRegistroProps {
  isOpen: boolean
  onClose: () => void
  asignacion: AsignacionTable | null
  onSuccess: () => void
}

export const AlertaEstadoRegistro = ({
  isOpen,
  onClose,
  asignacion,
  onSuccess,
}: AlertaEstadoRegistroProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  // const cambiarEstadoModulo = async () => {
  //   if (!registro) return

  //   try {
  //     setLoading(true)
  //     await delay(800)

  //     const respuesta = await sesionPeticion({
  //       url: `${Constantes.baseUrl}/casos_servicio/${registro.id}/${registro.estado === 'ACTIVO' ? 'inactivacion' : 'activacion'
  //         }`,
  //       method: 'patch',
  //     })

  //     Alerta({
  //       mensaje: InterpreteMensajes(respuesta),
  //       variant: 'success',
  //     })

  //     onSuccess()
  //     onClose()
  //   } catch (e) {
  //     imprimir('Error estado módulo', e)
  //     Alerta({
  //       mensaje: `${InterpreteMensajes(e)}`,
  //       variant: 'error',
  //     })
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60">
      <div className="panel w-full max-w-lg p-5 animate__animated animate__zoomIn">
        {/* HEADER */}
        <div className="mb-3">
          <h5 className="text-lg font-bold">Confirmar cambio de estado</h5>
        </div>

        {/* BODY */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ¿Está seguro de eliminar el caso de servicio:{' '}
          <span className="font-semibold">
            {titleCase(asignacion?.nombreCaso || '')}
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
            className="btn btn-danger"
            onClick={onClose}
            disabled={loading}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
