import { Injectable } from '@nestjs/common'
import { LgiRepository } from '../repository/lgi.repository'
import { PaginacionQueryDto } from '@/common/dto'
import { BuscarAsignacionLgiQueryDto } from '../dto/buscar-asignacion-lgi-query.dto'
/**
 * Service LGI — capa de negocio para felcn_lgi
 * Origen: sistema legacy GIAEF — pg.sql (docs/migrations/pg.sql)
 */
@Injectable()
export class LgiService {
  constructor(private readonly repository: LgiRepository) { }

  /**
   * Obtiene los casos donde el usuario actual es el investigador asignado.
   * Origen: LGI-MEN2.aspx.cs
   */
  async buscarMisCasos(usuario: string, filtros: BuscarAsignacionLgiQueryDto, paginacion: PaginacionQueryDto) {
    return this.repository.buscarMisCasos(usuario, filtros, paginacion)
  }

  // ==================== OPERATIVO ====================

  async listarOperativosPorCaso(casosId: string) {
    return this.repository.listarOperativosPorCaso(casosId)
  }
}
