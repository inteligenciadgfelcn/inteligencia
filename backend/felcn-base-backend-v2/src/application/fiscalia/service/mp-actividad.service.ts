import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { FiscaliaRepository } from '../repository/fiscalia.repository'
import { MpCasoActividad } from '../entity/mp-caso-actividad.entity'
import { MpCasoService } from './mp-caso.service'
import { CrearActividadesDto } from '../dto/actividad.dto'

/* eslint-disable camelcase */

/**
 * Servicio MpActividadService
 * Recepción de actividades / actos investigativos del caso (3.15).
 * El meta_data polimórfico se conserva íntegro en el payload JSONB.
 */
@Injectable()
export class MpActividadService extends BaseService {
  constructor(
    private readonly repository: FiscaliaRepository,
    private readonly mpCasoService: MpCasoService
  ) {
    super()
  }

  async crearActividades(polCasoId: string, dto: CrearActividadesDto) {
    await this.mpCasoService.buscarPorPolCasoId(polCasoId)

    const actividades: {
      mp_caso_actividad_id: number
      pol_caso_actividad_id: number
    }[] = []
    let algunoCreado = false

    for (const item of dto.actividades) {
      const existente = await this.repository.buscarUno(MpCasoActividad, {
        mpCasoActividadId: String(item.mp_caso_actividad_id),
      })
      if (existente) {
        actividades.push({
          mp_caso_actividad_id: item.mp_caso_actividad_id,
          pol_caso_actividad_id: Number(existente.polCasoActividadId),
        })
        continue
      }

      const tipoSolicitud = item.meta_data?.tipo_solicitud_id
      const creado = await this.repository.crear(MpCasoActividad, {
        mpCasoActividadId: String(item.mp_caso_actividad_id),
        polCasoId,
        actividadId: item.actividad_id,
        archivoHash: item.archivo_hash,
        tipoSolicitudId:
          typeof tipoSolicitud === 'number' ? tipoSolicitud : null,
        payload: { ...item },
      })
      algunoCreado = true
      actividades.push({
        mp_caso_actividad_id: item.mp_caso_actividad_id,
        pol_caso_actividad_id: Number(creado.polCasoActividadId),
      })
    }

    this.logger.audit('fiscalia', {
      mensaje: 'Actividades MP registradas',
      metadata: { polCasoId, cantidad: dto.actividades.length },
    })

    return { actividades, algunoCreado }
  }
}
