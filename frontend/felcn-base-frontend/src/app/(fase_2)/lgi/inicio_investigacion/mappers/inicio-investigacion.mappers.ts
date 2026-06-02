import dayjs from 'dayjs'

import type { InicioInvestigacionItem } from '../types/inicio-investigacion.types'

export const formatFechaRemision = (fecha: string) =>
  fecha ? dayjs(fecha).format('DD/MM/YYYY') : '-'

export const mapInvestigacionDetalle = (item: InicioInvestigacionItem) => ({
  ...item,
  fechaRemisionTexto: formatFechaRemision(item.fechaRemision),
})
