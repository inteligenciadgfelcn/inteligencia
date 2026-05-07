import { Injectable } from '@nestjs/common'
import { InvestigacionRepository } from '../repository/investigacion.repository'
import { BuscarAsignacionQueryDto } from '../dto/buscar-asignacion-query.dto'
import { PaginacionQueryDto } from '@/common/dto'
import { InvestigacionParalela } from '../../casos-paralelos/entity/investigacion-paralela.entity'
import { Operativo } from '../../operativo/entity/operativo.entity'

@Injectable()
export class InvestigacionService {
  constructor(private readonly repository: InvestigacionRepository) {}

  // ==================== ASIGNACION ====================

  listarInvestigadoresPorUnidad(abreviaturaUnidad: string) {
    return this.repository.listarInvestigadoresPorUnidad(abreviaturaUnidad)
  }

  buscarAsignacion(filtros: BuscarAsignacionQueryDto) {
    return this.repository.buscarAsignacion(filtros)
  }

  async listarOperativosPorCaso(idCaso: string) {
    const operativos = await this.repository.listarOperativosPorCaso(idCaso)
    return operativos.map((op) => this.mapearOperativo(op))
  }

  // ==================== INVESTIGACION PARALELA ====================

  async listarEnAnalisis(abreviaturaUnidad: string, paginacion: PaginacionQueryDto) {
    const [casos, total] = await this.repository.listarPorEstado(
      abreviaturaUnidad,
      false,
      paginacion
    )
    return [this.mapearCasos(casos, 'SIN RESPUESTA'), total] as const
  }

  async listarJudicializados(abreviaturaUnidad: string, paginacion: PaginacionQueryDto) {
    const [casos, total] = await this.repository.listarPorEstado(
      abreviaturaUnidad,
      true,
      paginacion,
      true
    )
    return [this.mapearCasos(casos, 'JUDICIALIZADO'), total] as const
  }

  async listarDesestimados(abreviaturaUnidad: string, paginacion: PaginacionQueryDto) {
    const [casos, total] = await this.repository.listarPorEstado(
      abreviaturaUnidad,
      true,
      paginacion,
      false
    )
    return [this.mapearCasos(casos, 'DESESTIMADO'), total] as const
  }

  // ==================== MAPEO ====================

  private mapearOperativo(op: Operativo) {
    return {
      id: op.id,
      nroInforme: op.numeroInforme,
      fechaOperativo: op.fechaOperativo,
      lugarCompleto: [
        op.departamento?.descripcion?.trim(),
        op.provincia?.descripcion?.trim(),
        op.localidad?.descripcion?.trim(),
        op.lugar?.trim(),
      ]
        .filter(Boolean)
        .join(' '),
      unidadDistrital: [
        op.unidad?.descripcion?.trim(),
        op.distrital?.descripcion?.trim(),
      ]
        .filter(Boolean)
        .join(' '),
      relacionHecho: op.descripcion,
    }
  }

  private mapearCasos(casos: InvestigacionParalela[], estado: string) {
    return casos.map((ip) => ({
      id: ip.id,
      estado,
      departamento: ip.departamento?.descripcion ?? '',
      unidad: ip.unidad?.descripcion ?? '',
      distrital: ip.distrital?.descripcion ?? '',
      grupo: ip.grupo?.descripcion ?? '',
      delito: ip.delito,
      numeroCaso: ip.numeroCaso,
      asignadoCaso: ip.asignadoCaso,
      fiscalAsignadoCaso: ip.fiscalAsignadoCaso,
      delitoPrecedente: ip.delitoPrecedente,
      informe: ip.informe,
      fechaEnvio: ip.fechaEnvioInvestigacionParalela,
      fechaRespuesta: ip.fechaRespuestaInvestigacionParalela ?? null,
    }))
  }
}
