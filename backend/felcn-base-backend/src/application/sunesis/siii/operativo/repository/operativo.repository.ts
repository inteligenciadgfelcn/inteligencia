import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { DB_ASIG_CASOS } from '@/core/config/database/database.module'
import { PaginacionQueryDto } from '@/common/dto'
import { auditoriaContexto } from '@/common/context/auditoria-contexto'
import { AsignacionASIG } from '@/application/inteligencia/felcn_asignacion_caso/asignaciones/entities/asignacionAsig.entity'

// Entities
import { Operativo } from '../entity/operativo.entity'
import { Droga } from '../entity/droga.entity'
import { SustanciaSolida } from '../entity/sustancia-solida.entity'
import { SustanciaLiquida } from '../entity/sustancia-liquida.entity'
import { Fabrica } from '../entity/fabrica.entity'
import { ItemBienSecuestrado } from '../entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from '../entity/item-bien-caracteristica.entity'
import { PersonaAuxiliar } from '../entity/persona-auxiliar.entity'
import { ArrestadoAuxiliar } from '../entity/arrestado-auxiliar.entity'
import { Galeria } from '../entity/galeria.entity'
import { Logotipo } from '../entity/logotipo.entity'
import { Coca } from '../entity/coca.entity'
import { ServidorPolicial } from '../entity/servidor-policial.entity'
import { AsignacionSiii } from '../../asignacion/entity/asignacion-siii.entity'


@Injectable()
export class OperativoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource,
    @InjectDataSource(DB_ASIG_CASOS)
    private asigCasosDataSource: DataSource
  ) { }

  /**
   * Ejecuta `fn` dentro de una transaccion que fija `app.usuario_nombre`
   * (set_config con is_local=true, valido solo para esta transaccion/conexion)
   * antes de operar, para que los triggers de auditoria de BD
   * (_usuario_creacion/_usuario_modificacion) usen el usuario real del JWT
   * en vez de caer al usuario tecnico de conexion.
   * Reemplaza la dependencia del interceptor global (best-effort, conexion no garantizada)
   * por un mecanismo confiable dentro del modulo de operativos.
   */
  private async conAuditoria<T>(
    fn: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    const usuarioNombre = auditoriaContexto.getStore()?.userName
    return this.dataSource.transaction(async (manager) => {
      if (usuarioNombre) {
        // SET LOCAL no admite parametros bindeados ($1); set_config() si.
        await manager.query(
          "SELECT set_config('app.usuario_nombre', $1, true)",
          [usuarioNombre]
        )
      }
      return fn(manager)
    })
  }

  // ==================== OPERATIVO ====================

  /**
   * Busca la fecha del operativo en a_felcn_asignacion_caso.asignacion,
   * vinculada al caso de SIII mediante id_caso_siii.
   */
  async buscarFechaOperativoPorIdCasoSiii(
    idCasoSiii: string
  ): Promise<Date | null> {
    const asignacion = await this.asigCasosDataSource
      .getRepository(AsignacionASIG)
      .findOne({ where: { idCasoSiii: Number(idCasoSiii) } })
    return asignacion?.fechaOperativo ?? null
  }

  private get operativoRepo() {
    return this.dataSource.getRepository(Operativo)
  }

  async crearOperativo(operativo: Operativo): Promise<Operativo> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Operativo).save(operativo)
    )
  }

  async listar(paginacion: PaginacionQueryDto): Promise<[Operativo[], number]> {
    return this.operativoRepo.findAndCount({
      order: { fechaOperativo: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async buscarPorId(id: string): Promise<Operativo | null> {
    return this.operativoRepo.findOne({
      where: { id },
      relations: ['unidad', 'planOperacion', 'tipoOperacion']
    })
  }

  async buscarPorCaso(idCaso: string): Promise<Operativo[]> {
    return this.operativoRepo.find({
      where: { idCaso },
      relations: ['unidad', 'planOperacion', 'tipoOperacion', 'tipoDenuncia', 'tipoPenal', 'tipoRelevancia'],
      order: { fechaOperativo: 'DESC' },
    })
  }

  async buscarPorNumeroOperativo(
    numeroOperativo: string
  ): Promise<Operativo | null> {
    return this.operativoRepo.createQueryBuilder('operativo')
      .innerJoin(AsignacionSiii, 'asignacion', 'operativo.idCaso = asignacion.idCaso')
      .where('asignacion.numeroOperativo = :numeroOperativo', { numeroOperativo })
      .leftJoinAndSelect('operativo.unidad', 'unidad')
      .leftJoinAndSelect('operativo.planOperacion', 'planOperacion')
      .leftJoinAndSelect('operativo.tipoOperacion', 'tipoOperacion')
      .leftJoinAndSelect('operativo.tipoDenuncia', 'tipoDenuncia')
      .leftJoinAndSelect('operativo.tipoPenal', 'tipoPenal')
      .leftJoinAndSelect('operativo.tipoRelevancia', 'tipoRelevancia')
      .orderBy('operativo.fechaOperativo', 'DESC')
      .getOne()
  }

  async resolverPorCaso(idCaso: string): Promise<Operativo | null> {
    return this.operativoRepo.findOne({
      where: { idCaso },
      order: { fechaOperativo: 'DESC' },
    })
  }

  async actualizarOperativo(operativo: Operativo): Promise<Operativo> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Operativo).save(operativo)
    )
  }

  // ==================== DROGAS ====================

  private get drogaRepo() {
    return this.dataSource.getRepository(Droga)
  }

  async crearDroga(droga: Droga): Promise<Droga> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Droga).save(droga)
    )
  }

  async listarDrogasPorOperativo(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[Droga[], number]> {
    return this.drogaRepo.findAndCount({
      where: { idOperativo },
      relations: [
        'estadoDroga',
        'estadoDroga.tipoDroga',
        'formaTransporte',
        'paisProcedencia',
        'paisDestino',
        'operativo',
        'operativo.unidad',
      ],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async buscarDrogaPorId(id: string): Promise<Droga | null> {
    return this.drogaRepo.findOne({ where: { id }, relations: ['estadoDroga'] })
  }

  async eliminarDroga(id: string): Promise<void> {
    await this.drogaRepo.delete(id)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  private get sustanciaSolidaRepo() {
    return this.dataSource.getRepository(SustanciaSolida)
  }

  async crearSustanciaSolida(
    sustancia: SustanciaSolida
  ): Promise<SustanciaSolida> {
    return this.conAuditoria((manager) =>
      manager.getRepository(SustanciaSolida).save(sustancia)
    )
  }

  async listarSustanciasSolidasPorOperativo(
    idOperativo: string,
    paginacion: PaginacionQueryDto
  ): Promise<[SustanciaSolida[], number]> {
    return this.sustanciaSolidaRepo.findAndCount({
      where: { idOperativo },
      relations: ['descripcionRef'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarSustanciaSolida(id: string): Promise<void> {
    await this.sustanciaSolidaRepo.delete(id)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  private get sustanciaLiquidaRepo() {
    return this.dataSource.getRepository(SustanciaLiquida)
  }

  async crearSustanciaLiquida(
    sustancia: SustanciaLiquida
  ): Promise<SustanciaLiquida> {
    return this.conAuditoria((manager) =>
      manager.getRepository(SustanciaLiquida).save(sustancia)
    )
  }

  async listarSustanciasLiquidasPorOperativo(
    idOperativo: string,
    paginacion: PaginacionQueryDto
  ): Promise<[SustanciaLiquida[], number]> {
    return this.sustanciaLiquidaRepo.findAndCount({
      where: { idOperativo },
      relations: ['descripcionRef'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarSustanciaLiquida(id: string): Promise<void> {
    await this.sustanciaLiquidaRepo.delete(id)
  }

  // ==================== FÁBRICAS ====================

  private get fabricaRepo() {
    return this.dataSource.getRepository(Fabrica)
  }

  async crearFabrica(fabrica: Fabrica): Promise<Fabrica> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Fabrica).save(fabrica)
    )
  }

  async listarFabricasPorOperativo(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[Fabrica[], number]> {
    return this.fabricaRepo.findAndCount({
      where: { idOperativo },
      relations: ['fabricaModelo', 'fabricaModelo.tipoFabrica'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarFabrica(id: string): Promise<void> {
    await this.fabricaRepo.delete(id)
  }

  // ==================== BIENES SECUESTRADOS ====================

  private get bienRepo() {
    return this.dataSource.getRepository(ItemBienSecuestrado)
  }

  async crearBien(bien: ItemBienSecuestrado): Promise<ItemBienSecuestrado> {
    return this.conAuditoria((manager) =>
      manager.getRepository(ItemBienSecuestrado).save(bien)
    )
  }

  async listarBienesPorOperativo(
    idOperativo: string,
    paginacion: PaginacionQueryDto
  ): Promise<[ItemBienSecuestrado[], number]> {
    return this.bienRepo.findAndCount({
      where: { idOperativo },
      relations: ['catalogoTipo', 'catalogoTipo.catalogoClase', 'catalogoTipo.catalogoClase.bien'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarBien(id: string): Promise<void> {
    await this.bienRepo.delete(id)
  }

  // ==================== CARACTERÍSTICAS DE BIENES ====================

  private get bienCaracteristicaRepo() {
    return this.dataSource.getRepository(ItemBienCaracteristica)
  }

  async crearBienCaracteristica(
    caracteristica: ItemBienCaracteristica
  ): Promise<ItemBienCaracteristica> {
    return this.conAuditoria((manager) =>
      manager.getRepository(ItemBienCaracteristica).save(caracteristica)
    )
  }

  async listarCaracteristicasPorBien(
    idItemBienSecuestrado: string,
    paginacion: PaginacionQueryDto
  ): Promise<[ItemBienCaracteristica[], number]> {
    return this.bienCaracteristicaRepo.findAndCount({
      where: { idItemBienSecuestrado },
      relations: ['catalogoCaracteristica'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async buscarBienCaracteristica(
    id: string
  ): Promise<ItemBienCaracteristica | null> {
    return this.bienCaracteristicaRepo.findOne({ where: { id } })
  }

  async eliminarBienCaracteristica(id: string): Promise<void> {
    await this.bienCaracteristicaRepo.delete(id)
  }

  // ==================== perosnas aux ====================

  private get personaAuxiliarRepo() {
    return this.dataSource.getRepository(PersonaAuxiliar)
  }

  async crearPersonaAuxiliar(persona: PersonaAuxiliar): Promise<PersonaAuxiliar> {
    return this.conAuditoria((manager) =>
      manager.getRepository(PersonaAuxiliar).save(persona)
    )
  }

  async listarPersonasAuxiliaresPorOperativo(
    idOperativo: string,
    paginacion: PaginacionQueryDto
  ): Promise<[PersonaAuxiliar[], number]> {
    return this.personaAuxiliarRepo.findAndCount({
      where: { idOperativo },
      relations: ['pais', 'tipoDocumento'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarPersonaAuxiliar(id: string): Promise<void> {
    await this.personaAuxiliarRepo.delete(id)
  }

  async actualizarFotoPersonaAuxiliar(
    id: string,
    campo: 'foto_frente' | 'foto_documento' | 'foto_perfil_izquierdo',
    foto: Buffer
  ): Promise<void> {
    await this.conAuditoria((manager) =>
      manager.getRepository(PersonaAuxiliar).update(id, {
        [campo]: foto,
      } as any)
    )
  }

  // ==================== GALERÍA ====================

  private get galeriaRepo() {
    return this.dataSource.getRepository(Galeria)
  }

  async crearGaleria(galeria: Galeria): Promise<Galeria> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Galeria).save(galeria)
    )
  }

  async listarGaleriaPorOperativo(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[Galeria[], number]> {
    return this.galeriaRepo.findAndCount({
      where: { idOperativo },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarGaleria(id: string): Promise<void> {
    await this.galeriaRepo.delete(id)
  }

  // ==================== LOGOTIPOS ====================

  private get logotipoRepo() {
    return this.dataSource.getRepository(Logotipo)
  }

  async crearLogotipo(logotipo: Logotipo): Promise<Logotipo> {
    return this.conAuditoria((manager) =>
      manager.getRepository(Logotipo).save(logotipo)
    )
  }

  async listarLogotiposPorDroga(idDroga: string, paginacion: PaginacionQueryDto): Promise<[Logotipo[], number]> {
    return this.logotipoRepo.findAndCount({
      where: { idDroga },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarLogotipo(id: string): Promise<void> {
    await this.logotipoRepo.delete(id)
  }


  // ==================== RESUMEN/PESAJE ====================


  async obtenerResumenDrogas(idOperativo: string): Promise<any> {
    const result = await this.drogaRepo
      .createQueryBuilder('d')
      .select('SUM(d.cantidad_gramos)', 'totalGramos')
      .addSelect('COUNT(*)', 'totalRegistros')
      .where('d.id_operativo = :idOperativo', { idOperativo })
      .getRawOne()
    return result
  }

  async obtenerEstadisticasOperativo(idOperativo: string): Promise<any> {
    const [
      cantidadDrogas,
      cantidadSustanciasSolidas,
      cantidadSustanciasLiquidas,
      cantidadFabricas,
      cantidadBienes,
      cantidadDetenidos,
      cantidadGaleria,
    ] = await Promise.all([
      this.drogaRepo.count({ where: { idOperativo } }),
      this.sustanciaSolidaRepo.count({ where: { idOperativo } }),
      this.sustanciaLiquidaRepo.count({ where: { idOperativo } }),
      this.fabricaRepo.count({ where: { idOperativo } }),
      this.bienRepo.count({ where: { idOperativo } }),
      this.personaAuxiliarRepo.count({ where: { idOperativo } }),
      this.galeriaRepo.count({ where: { idOperativo } }),
    ])

    return {
      drogas: cantidadDrogas,
      sustanciasSolidas: cantidadSustanciasSolidas,
      sustanciasLiquidas: cantidadSustanciasLiquidas,
      fabricas: cantidadFabricas,
      bienes: cantidadBienes,
      detenidos: cantidadDetenidos,
      galeria: cantidadGaleria,
    }
  }

  // ==================== IMÁGENES ====================

  async buscarGaleriaPorId(id: string): Promise<Galeria | null> {
    return this.galeriaRepo.findOne({ where: { id } })
  }

  async buscarPersonaAuxiliarPorId(id: string): Promise<PersonaAuxiliar | null> {
    return this.personaAuxiliarRepo.findOne({ where: { id } })
  }

  async buscarBienPorId(id: string): Promise<ItemBienSecuestrado | null> {
    return this.bienRepo.findOne({ where: { id } })
  }

  // Corresponde a Button2_Click de ABM-ING-COSTO: UPDATE SET CostoAprox, CostoCuant WHERE id
  async actualizarCostoBien(
    id: string,
    costoAproximado: number,
    costoCuantificado: number
  ): Promise<void> {
    await this.conAuditoria((manager) =>
      manager
        .getRepository(ItemBienSecuestrado)
        .update(id, { costoAproximado, costoCuantificado })
    )
  }

  // Corresponde a calcula() de ABM-ING-COSTO: SUM(CostoCuant) y SUM*tipoCambio
  async calcularPatrimonioBienes(
    idOperativo: string,
    tipoCambio: number
  ): Promise<{ totalDolares: number; totalBolivianos: number; cantidadBienes: number }> {
    const result = await this.bienRepo
      .createQueryBuilder('b')
      .select('COALESCE(SUM(b.costo_cuantificado), 0)', 'totalDolares')
      .addSelect('COUNT(b.id_item_bien_secuestrado)', 'cantidadBienes')
      .where('b.id_operativo = :idOperativo', { idOperativo })
      .getRawOne()

    const totalDolares = parseFloat(result?.totalDolares ?? '0')
    return {
      totalDolares,
      totalBolivianos: parseFloat((totalDolares * tipoCambio).toFixed(2)),
      cantidadBienes: parseInt(result?.cantidadBienes ?? '0', 10),
    }
  }

  async buscarLogotipoPorId(id: string): Promise<Logotipo | null> {
    return this.logotipoRepo.findOne({ where: { id } })
  }
}
