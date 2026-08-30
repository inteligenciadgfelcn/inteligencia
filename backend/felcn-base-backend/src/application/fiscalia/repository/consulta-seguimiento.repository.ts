import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, In } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { AsignacionSiii } from '@/application/sunesis/siii/asignacion/entity/asignacion-siii.entity'
import { EtapaInvestigacion } from '@/application/sunesis/siii/parametrica/entity/operativo/etapa-investigacion.entity'

/** Asignación con la descripción de etapa de investigación ya resuelta — asignada en memoria. */
export type AsignacionConEtapa = AsignacionSiii & { descripcionEtapa: string | null }

/**
 * Repositorio ConsultaSeguimientoRepository
 * Resuelve el caso (asignación) por CUD y lista casos paginados para la
 * API de consulta de seguimiento que expone FELCN a la Fiscalía. El
 * detalle anidado (fiscales, bienes, personas, etc.) se arma reutilizando
 * los services internos ya existentes (SeguimientoService, BienesService,
 * PersonasService — ver ConsultaSeguimientoService).
 */
@Injectable()
export class ConsultaSeguimientoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  /**
   * Busca el caso por CUD. El correlativo real usado hoy es la columna
   * `ianus` de la asignación — ver nota en ConsultaOperativoRepository.
   */
  async buscarPorCud(cud: string): Promise<AsignacionConEtapa | null> {
    const asignacion = await this.dataSource
      .getRepository(AsignacionSiii)
      .findOne({ where: { ianus: cud } })
    if (!asignacion) return null
    return this.adjuntarEtapa([asignacion]).then((r) => r[0])
  }

  async listarPaginado(paginacion: PaginacionQueryDto): Promise<[AsignacionConEtapa[], number]> {
    const [asignaciones, total] = await this.dataSource.getRepository(AsignacionSiii).findAndCount({
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
    return [await this.adjuntarEtapa(asignaciones), total]
  }

  private async adjuntarEtapa(asignaciones: AsignacionSiii[]): Promise<AsignacionConEtapa[]> {
    if (asignaciones.length === 0) return []
    const idsEtapa = [
      ...new Set(asignaciones.map((a) => a.idEtapaInvestigacion).filter((id): id is number => !!id)),
    ]
    const etapas = idsEtapa.length
      ? await this.dataSource.getRepository(EtapaInvestigacion).find({ where: { id: In(idsEtapa) } })
      : []
    const porId = new Map(etapas.map((e) => [e.id, e.descripcion]))
    return asignaciones.map((a) =>
      Object.assign(a, {
        descripcionEtapa: a.idEtapaInvestigacion ? porId.get(a.idEtapaInvestigacion) ?? null : null,
      })
    )
  }
}
