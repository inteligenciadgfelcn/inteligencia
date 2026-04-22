'use client'

import { useMemo, useState } from 'react'

export type SeccionKey =
  | 'seccion-1'
  | 'seccion-2'
  | 'seccion-3'
  | 'seccion-4'
  | 'seccion-5'
  | 'seccion-6'
  | 'seccion-7'
  | 'seccion-8'
  | 'seccion-10'

export function useGestionOperativoForm(idGestionOperativo?: string) {
  const [seccionActiva, setSeccionActiva] = useState<SeccionKey>('seccion-1')

  const idNumerico = useMemo(
    () => Number(idGestionOperativo ?? 0),
    [idGestionOperativo]
  )
  const esEdicion = idNumerico > 0

  return {
    idGestionOperativo: idNumerico,
    esEdicion,
    seccionActiva,
    setSeccionActiva,
  }
}
