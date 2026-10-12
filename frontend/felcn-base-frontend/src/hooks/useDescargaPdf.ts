'use client'

import { useCallback } from 'react'

import { useAlerts } from '@/hooks/useAlerts'
import { abrirPdfEnNuevaPestana } from '@/utils/peticion'

export const useDescargaPdf = () => {
  const { Alerta } = useAlerts()

  const descargarPdf = useCallback(
    async (obtenerBlob: () => Promise<Blob>, etiqueta = 'el reporte') => {
      Alerta({ mensaje: 'Iniciando descarga…', variant: 'info' })
      try {
        await abrirPdfEnNuevaPestana(obtenerBlob)
      } catch {
        Alerta({
          mensaje: `No se pudo descargar ${etiqueta}. Intente nuevamente.`,
          variant: 'error',
        })
      }
    },
    [Alerta]
  )

  return { descargarPdf }
}
