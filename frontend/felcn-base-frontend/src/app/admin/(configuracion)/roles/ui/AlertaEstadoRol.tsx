'use client'

import { useState } from 'react'
import { useAlerts, useSession } from '@/hooks'
import { Constantes } from '@/config/Constantes'
import { InterpreteMensajes, delay, titleCase } from '@/utils'
import { imprimir } from '@/utils/imprimir'
import { RolCRUDType } from '@/app/admin/(configuracion)/roles/types/rolCRUDType'

/* ================= PROPS ================= */

export interface AlertaEstadoRolProps {
  isOpen: boolean
  onClose: () => void
  rol: RolCRUDType | null
  onSuccess: () => void
}

/* ================= COMPONENT ================= */

export const AlertaEstadoRol = ({
  isOpen,
  onClose,
  rol,
  onSuccess,
}: AlertaEstadoRolProps) => {
  const { Alerta } = useAlerts()
  const { sesionPeticion } = useSession()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const cambiarEstadoRol = async () => {
    if (!rol) return

    try {
      setLoading(true)
      await delay(800)

      const resp = await sesionPeticion({
        url: `${Constantes.baseUrl}/autorizacion/roles/${rol.id}/${
          rol.estado === 'ACTIVO' ? 'inactivacion' : 'activacion'
        }`,
        method: 'patch',
      })

      Alerta({
        mensaje: InterpreteMensajes(resp),
        variant: 'success',
      })

      onSuccess()
      onClose()
    } catch (e) {
      imprimir('Error estado rol', e)
      Alerta({
        mensaje: InterpreteMensajes(e),
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
          <h5 className="text-lg font-semibold">
            Confirmar cambio de estado
          </h5>
        </div>

        {/* BODY */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ¿Está seguro de{' '}
          <span className="font-semibold">
            {rol?.estado === 'ACTIVO' ? 'inactivar' : 'activar'}
          </span>{' '}
          el rol:{' '}
          <span className="font-semibold">
            {titleCase(rol?.nombre || '')}
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
            onClick={cambiarEstadoRol}
            disabled={loading}
          >
            Confirmar
          </button>

        </div>

      </div>
    </div>
  )
}
