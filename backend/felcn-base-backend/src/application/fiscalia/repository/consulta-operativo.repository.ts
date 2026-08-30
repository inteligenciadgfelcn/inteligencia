import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, In } from 'typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { Operativo } from '@/application/sunesis/siii/operativo/entity/operativo.entity'
import { Droga } from '@/application/sunesis/siii/operativo/entity/droga.entity'
import { SustanciaSolida } from '@/application/sunesis/siii/operativo/entity/sustancia-solida.entity'
import { SustanciaLiquida } from '@/application/sunesis/siii/operativo/entity/sustancia-liquida.entity'
import { Fabrica } from '@/application/sunesis/siii/operativo/entity/fabrica.entity'
import { ItemBienSecuestrado } from '@/application/sunesis/siii/operativo/entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from '@/application/sunesis/siii/operativo/entity/item-bien-caracteristica.entity'
import { PersonaAuxiliar } from '@/application/sunesis/siii/operativo/entity/persona-auxiliar.entity'
import { Galeria } from '@/application/sunesis/siii/operativo/entity/galeria.entity'
import { Logotipo } from '@/application/sunesis/siii/operativo/entity/logotipo.entity'
import { AsignacionSiii } from '@/application/sunesis/siii/asignacion/entity/asignacion-siii.entity'

const RELACIONES_OPERATIVO = [
  'unidad',
  'planOperacion',
  'tipoOperacion',
  'departamento',
  'provincia',
  'localidad',
  'distrital',
  'tipoDenuncia',
  'tipoPenal',
  'tipoRelevancia',
]

/** Operativo con la asignación (caso) ya resuelta — asignada en memoria, no es una relación TypeORM. */
export type OperativoConAsignacion = Operativo & { asignacion: AsignacionSiii | null }

/**
 * Repositorio ConsultaOperativoRepository
 * Consultas de solo lectura para la API de consulta de operativos que
 * expone FELCN a la Fiscalía. A diferencia de OperativoRepository (uso
 * interno, listados paginados por sub-sección), aquí cada operativo se
 * devuelve con TODOS sus hijos (sin paginar) para armar el JSON anidado.
 */
@Injectable()
export class ConsultaOperativoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  async listarPaginado(
    paginacion: PaginacionQueryDto
  ): Promise<[OperativoConAsignacion[], number]> {
    const [operativos, total] = await this.dataSource.getRepository(Operativo).findAndCount({
      relations: RELACIONES_OPERATIVO,
      order: { fechaOperativo: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
    return [await this.adjuntarAsignaciones(operativos), total]
  }

  /**
   * Busca el operativo por CUD. El correlativo real usado hoy es la
   * columna `ianus` de la asignación — la generación/población del CUD
   * definitivo (regla del Excel/análisis) queda pendiente; por ahora el
   * campo `cud` de la API se resuelve desde esa misma columna.
   */
  async buscarPorCud(cud: string): Promise<OperativoConAsignacion | null> {
    const asignacion = await this.dataSource
      .getRepository(AsignacionSiii)
      .findOne({ where: { ianus: cud } })
    if (!asignacion) return null

    const operativo = await this.dataSource.getRepository(Operativo).findOne({
      where: { idCaso: asignacion.idCaso },
      relations: RELACIONES_OPERATIVO,
      order: { fechaOperativo: 'DESC' },
    })
    if (!operativo) return null

    return Object.assign(operativo, { asignacion })
  }

  /** Cabecera de operativo por idCaso — usada para embeber el resumen dentro de la API de seguimientos. */
  async buscarCabeceraPorIdCaso(idCaso: string): Promise<OperativoConAsignacion | null> {
    const operativo = await this.dataSource.getRepository(Operativo).findOne({
      where: { idCaso },
      relations: RELACIONES_OPERATIVO,
      order: { fechaOperativo: 'DESC' },
    })
    if (!operativo) return null

    const asignacion = await this.dataSource
      .getRepository(AsignacionSiii)
      .findOne({ where: { idCaso } })

    return Object.assign(operativo, { asignacion: asignacion ?? null })
  }

  private async adjuntarAsignaciones(operativos: Operativo[]): Promise<OperativoConAsignacion[]> {
    if (operativos.length === 0) return []
    const idCasos = [...new Set(operativos.map((o) => o.idCaso))]
    const asignaciones = await this.dataSource
      .getRepository(AsignacionSiii)
      .find({ where: { idCaso: In(idCasos) } })
    const porIdCaso = new Map(asignaciones.map((a) => [a.idCaso, a]))
    return operativos.map((o) => Object.assign(o, { asignacion: porIdCaso.get(o.idCaso) ?? null }))
  }

  async listarDrogas(idOperativo: string): Promise<Droga[]> {
    return this.dataSource.getRepository(Droga).find({
      where: { idOperativo },
      relations: ['estadoDroga', 'formaTransporte', 'paisProcedencia', 'paisDestino'],
      select: {
        id: true,
        cantidadGramos: true,
        cantidadUnidades: true,
        costo: true,
        fechaHoraIngreso: true,
        estadoDroga: { descripcion: true },
        formaTransporte: { descripcion: true },
        paisProcedencia: { descripcion: true },
        paisDestino: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarLogotipos(idDroga: string): Promise<Logotipo[]> {
    return this.dataSource.getRepository(Logotipo).find({
      where: { idDroga },
      select: {
        id: true,
        imagen: true,
        descripcionLogo: true,
        organizacion: true,
        blanco: true,
        observacion: true,
      },
    })
  }

  async listarSustanciasSolidas(idOperativo: string): Promise<SustanciaSolida[]> {
    return this.dataSource.getRepository(SustanciaSolida).find({
      where: { idOperativo },
      relations: ['descripcionRef'],
      select: {
        id: true,
        cantidad: true,
        costo: true,
        fechaHoraIngreso: true,
        descripcionRef: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarSustanciasLiquidas(idOperativo: string): Promise<SustanciaLiquida[]> {
    return this.dataSource.getRepository(SustanciaLiquida).find({
      where: { idOperativo },
      relations: ['descripcionRef'],
      select: {
        id: true,
        cantidad: true,
        costo: true,
        fechaHoraIngreso: true,
        descripcionRef: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarFabricas(idOperativo: string): Promise<Fabrica[]> {
    return this.dataSource.getRepository(Fabrica).find({
      where: { idOperativo },
      relations: ['fabricaModelo'],
      select: {
        id: true,
        cantidad: true,
        fechaHoraIngreso: true,
        fabricaModelo: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarPersonasAuxiliares(idOperativo: string): Promise<PersonaAuxiliar[]> {
    return this.dataSource.getRepository(PersonaAuxiliar).find({
      where: { idOperativo },
      relations: ['pais', 'tipoDocumento'],
      select: {
        id: true,
        nombres: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        apellidoEsposo: true,
        nroDocumento: true,
        fechaNacimiento: true,
        genero: true,
        direccion: true,
        estado: true,
        fechaHoraIngreso: true,
        pais: { descripcion: true },
        tipoDocumento: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarBienes(idOperativo: string): Promise<ItemBienSecuestrado[]> {
    return this.dataSource.getRepository(ItemBienSecuestrado).find({
      where: { idOperativo },
      relations: ['catalogoTipo'],
      select: {
        id: true,
        cantidadBien: true,
        costoAproximado: true,
        costoCuantificado: true,
        enInvestigacion: true,
        fechaHoraIngreso: true,
        catalogoTipo: { descripcion: true },
      },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async listarCaracteristicasBien(idItemBienSecuestrado: string): Promise<ItemBienCaracteristica[]> {
    return this.dataSource.getRepository(ItemBienCaracteristica).find({
      where: { idItemBienSecuestrado },
      relations: ['catalogoCaracteristica'],
      select: {
        id: true,
        descripcion: true,
        catalogoCaracteristica: { descripcion: true },
      },
    })
  }

  async listarGaleria(idOperativo: string): Promise<Galeria[]> {
    return this.dataSource.getRepository(Galeria).find({
      where: { idOperativo },
      select: { id: true, descripcion: true },
    })
  }
}
