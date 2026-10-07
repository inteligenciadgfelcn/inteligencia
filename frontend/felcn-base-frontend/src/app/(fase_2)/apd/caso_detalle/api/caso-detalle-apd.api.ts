import { Constantes } from '@/config/Constantes'
import { sesionPeticion } from '@/utils/peticion'

import type { CasoDetalle, CasoDetalleApiRow } from '../types/caso-detalle-apd.types'

const BASE = `${Constantes.baseUrl}/asignacion-lgi`

interface RespuestaCasoDetalle {
  finalizado: boolean
  mensaje: string
  datos: CasoDetalleApiRow
}

export const CasoDetalleApi = {
  async obtenerCasoDetalle(idCaso: string): Promise<CasoDetalle> {
    const response = await sesionPeticion({
      url: `${BASE}/${idCaso}`,
      method: 'get',
      withCredentials: true,
    }) as RespuestaCasoDetalle | CasoDetalleApiRow

    const raw: CasoDetalleApiRow =
      'datos' in response && response.datos ? response.datos as CasoDetalleApiRow : response as CasoDetalleApiRow

    return mapCasoDetalleRaw(raw)
  },
}

function mapCasoDetalleRaw(row: CasoDetalleApiRow): CasoDetalle {
  return {
    casosId: row.casosId ?? row.casos_id ?? '',
    dptoavId: row.dptoavId ?? row.dptoav_id ?? '',
    uniAbrev: row.uniAbrev ?? row.uni_abrev ?? '',
    disId: row.disId ?? row.dis_id ?? '',
    descripcionGrupo: row.descripcionGrupo ?? row.descripcion_grupo ?? '',
    nombreCaso: row.nombreCaso ?? row.nombrecaso ?? '',
    tipoCaso: row.tipoCaso ?? row.tipocaso ?? null,
    nroCasoGlaef: row.nroCasoGlaef ?? row.nrocasoglaef ?? null,
    nroCaso: row.nroCaso ?? row.nrocaso ?? '',
    nroCasoFis: row.nroCasoFis ?? row.nrocasofis ?? null,
    tiPenId: row.tiPenId ?? row.ti_pen_id ?? null,
    nroCasoIfp: row.nroCasoIfp ?? row.nrocasoifp ?? null,
    cudIfp: row.cudIfp ?? row.cudifp ?? '',
    perddom: row.perddom ?? null,
    nroCasoPerdom: row.nroCasoPerdom ?? row.nrocasoperdom ?? null,
    ianus: row.ianus ?? null,
    etaInv: row.etaInv ?? row.eta_inv ?? null,
    remiteFiscal: row.remiteFiscal ?? row.remitefiscal ?? '',
    remiteFecha: row.remiteFecha ?? row.remitefecha ?? null,
    fechaRecepcionFiscalia:
      row.fechaRecepcionFiscalia ?? row.fecha_recepcion_fiscalia ?? null,
    diasOtorgados: row.diasOtorgados ?? row.dias_otorgados ?? null,
    idEstado: row.idEstado ?? row.id_estado ?? null,
    inicioCaso: row.inicioCaso ?? row.inicio_caso ?? null,
    codigoServicio: row.codigoServicio ?? row.codigo_servicio ?? null,
    conformeA: row.conformeA ?? row.conformea ?? '',
    fechaInicio: row.fechaInicio ?? row.fechainicio ?? null,
    estado: row.estado ?? '',
    fechaHoraIng: row.fechaHoraIng ?? row.fechahoraing ?? '',
    usuario: row.usuario ?? '',
    usuarioActualizacion: row.usuarioActualizacion ?? row.usuario_actualizacion ?? null,
    fechaActualizacion: row.fechaActualizacion ?? row.fecha_actualizacion ?? '',
    idEtapa: row.idEtapa ?? '',
    fechaEtapaProcesal: row.fechaEtapaProcesal ?? '',
  }
}
