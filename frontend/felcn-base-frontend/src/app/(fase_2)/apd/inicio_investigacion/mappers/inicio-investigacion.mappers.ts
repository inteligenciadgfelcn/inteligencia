import { formatFecha } from '../../utils/fechas'

import type { InicioInvestigacionItem } from '../types/inicio-investigacion.types'

export const formatFechaRemision = (fecha: string) => formatFecha(fecha)

export const mapInvestigacionDetalle = (item: InicioInvestigacionItem) => ({
  ...item,
  fechaRemisionTexto: formatFechaRemision(item.fechaRemision),
})
