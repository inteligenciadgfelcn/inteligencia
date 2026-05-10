import { Injectable } from '@nestjs/common'
import { InvestigacionRepository } from '../repository/investigacion.repository'
import { BuscarAsignacionQueryDto } from '../dto/buscar-asignacion-query.dto'
import { CreateInvestigacionParalelaDto } from '../dto/create-investigacion-paralela.dto'
import { PaginacionQueryDto } from '@/common/dto'
import { InvestigacionParalela } from '../entity/investigacion-paralela.entity'
import { Investigador } from '../entity/investigador.entity'
import { Operativo } from '../../operativo/entity/operativo.entity'

@Injectable()
export class InvestigacionService {
  constructor(private readonly repository: InvestigacionRepository) { }

  // ==================== ASIGNACION ====================

  // listarInvestigadoresPorUnidad(abreviaturaUnidad: string) {
  //   return this.repository.listarInvestigadoresPorUnidad(abreviaturaUnidad)
  // }

  buscarAsignacion(filtros: BuscarAsignacionQueryDto) {
    return this.repository.buscarAsignacion(filtros)
  }

  async listarOperativosPorCaso(idCaso: string) {
    const operativos = await this.repository.listarOperativosPorCaso(idCaso)
    return operativos.map((op) => this.mapearOperativo(op))
  }

  // ==================== INVESTIGACION PARALELA ====================

  async crearInvestigacionParalela(
    dto: CreateInvestigacionParalelaDto,
    usuario: string
  ): Promise<InvestigacionParalela> {
    dto.usuario = usuario
    return this.repository.crearInvestigacionParalela(dto)
  }

  async actualizarInvestigacionParalela(
    dto: Partial<InvestigacionParalela>
  ): Promise<InvestigacionParalela> {
    return this.repository.actualizarInvestigacionParalela(dto)
  }

  async listar(
    paginacion: PaginacionQueryDto
  ): Promise<[InvestigacionParalela[], number]> {
    return this.repository.listar(paginacion)
  }

  async buscarPorId(id: string): Promise<InvestigacionParalela | null> {
    return this.repository.buscarPorId(id)
  }

  async buscarPorUnidadYResultado(
    unidad: string,
    resultado: boolean,
    paginacion: PaginacionQueryDto,
    respInvParalela?: boolean
  ) {
    const [casos, total] = await this.repository.listarPorEstado(
      unidad,
      resultado,
      paginacion,
      respInvParalela
    )
    const estado = resultado
      ? respInvParalela
        ? 'JUDICIALIZADO'
        : 'DESESTIMADO'
      : 'SIN RESPUESTA'
    return [this.mapearCasos(casos, estado), total] as const
  }

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
    return [this.mapearCasos(casos, 'SIN RESPUESTA'), total] as const
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

  // ==================== INVESTIGADOR ====================

  async crearInvestigador(investigador: Partial<Investigador>): Promise<Investigador> {
    return this.repository.crearInvestigador(investigador)
  }

  async listarInvestigadoresPorCaso(idCaso: string): Promise<Investigador[]> {
    return this.repository.listarInvestigadoresPorCaso(idCaso)
  }
}
