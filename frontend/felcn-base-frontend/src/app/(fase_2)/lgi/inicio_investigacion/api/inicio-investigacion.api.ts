import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type { InicioInvestigacionItem } from '../types/inicio-investigacion.types'

const BASE = `${Constantes.baseUrl}/asignacion-lgi`

interface FilaAsignacion {
  casosId?: string
  casos_id?: string
  nombreCaso?: string
  nombrecaso?: string
  nroCasoGiaef?: string
  nrocasogiaef?: string
  nroCaso?: string
  nrocaso?: string
  nroCasoFis?: string
  nrocasofis?: string
  perddom?: boolean
  nroCasoPerdom?: string
  nrocasoperdom?: string
  remiteFiscal?: string
  remitefiscal?: string
  fechaRecepcionFiscalia?: string | null
  remitefecha?: string | null
  conformeA?: string
  conformea?: string
  estado?: string
  fechaHoraIng?: string
  fechahoraing?: string
  fechaInicio?: string | null
  fechainicio?: string | null
  descripcionGrupo?: string
  descripcion_grupo?: string
  regional?: string
  etapaInvestigacion?: string
  [key: string]: unknown
}

interface RespuestaListado {
  finalizado: boolean
  mensaje: string
  datos: { total: number; filas: FilaAsignacion[] }
}

const texto = (value: unknown): string =>
  value == null ? '' : String(value)

export const mapFilaAsignacion = (row: FilaAsignacion): InicioInvestigacionItem => ({
  id: texto(row.casosId ?? row.casos_id),
  regional: texto(row.regional),
  nombreCaso: texto(row.nombreCaso ?? row.nombrecaso),
  estadoCaso: (texto(row.estado) || 'En análisis') as InicioInvestigacionItem['estadoCaso'],
  nroCasoGiaef: texto(row.nroCasoGiaef ?? row.nrocasogiaef),
  nroCasoFelcn: texto(row.nroCaso ?? row.nrocaso),
  nroCasoFiscalia: texto(row.nroCasoFis ?? row.nrocasofis),
  nroPerdidaDominio: row.perddom
    ? texto(row.nroCasoPerdom ?? row.nrocasoperdom)
    : '',
  iaunus: '',
  fiscalQueRemite: texto(row.remiteFiscal ?? row.remitefiscal),
  fechaRemision:
    texto(row.fechaRecepcionFiscalia ?? row.remitefecha ?? row.fechaHoraIng ?? row.fechahoraing),
  conformeA: texto(row.conformeA ?? row.conformea),
  investigador: '',
  departamento: texto(row.descripcionGrupo ?? row.descripcion_grupo ?? row.regional),
})

export const InicioInvestigacionApi = {
  async listarInvestigaciones(): Promise<InicioInvestigacionItem[]> {
    const respuesta = await sesionPeticion<RespuestaListado>({
      url: BASE,
      method: 'get',
      withCredentials: true,
    })
    return (respuesta.datos?.filas ?? []).map(mapFilaAsignacion)
  },

  async obtenerInvestigacion(id: string): Promise<InicioInvestigacionItem | null> {
    const fila = await sesionPeticion<FilaAsignacion>({
      url: `${BASE}/${id}`,
      method: 'get',
      withCredentials: true,
    })

    return fila ? mapFilaAsignacion(fila) : null
  },
}