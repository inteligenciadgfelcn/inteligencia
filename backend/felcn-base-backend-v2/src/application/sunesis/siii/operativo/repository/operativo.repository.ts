import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { PaginacionQueryDto } from '@/common/dto'

// Entities
import { Operativo } from '../entity/operativo.entity'
import { Droga } from '../entity/droga.entity'
import { SustanciaSolida } from '../entity/sustancia-solida.entity'
import { SustanciaLiquida } from '../entity/sustancia-liquida.entity'
import { Fabrica } from '../entity/fabrica.entity'
import { ItemBienSecuestrado } from '../entity/item-bien-secuestrado.entity'
import { ItemBienCaracteristica } from '../entity/item-bien-caracteristica.entity'
import { DetenidoAuxiliar } from '../entity/detenido-auxiliar.entity'
import { ArrestadoAuxiliar } from '../entity/arrestado-auxiliar.entity'
import { Galeria } from '../entity/galeria.entity'
import { Logotipo } from '../entity/logotipo.entity'
import { Coca } from '../entity/coca.entity'
import { ServidorPolicial } from '../entity/servidor-policial.entity'

// Catalogos
import { EstadoDroga } from '../entity/estado-droga.entity'
import { FabricaModelo } from '../entity/fabrica-modelo.entity'
import { ItemOperativo } from '../entity/item-operativo.entity'
import { CatalogoClase } from '../entity/catalogo-clase.entity'
import { CatalogoTipo } from '../entity/catalogo-tipo.entity'
import { CatalogoCaracteristica } from '../entity/catalogo-caracteristica.entity'

@Injectable()
export class OperativoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  // ==================== OPERATIVO ====================

  private get operativoRepo() {
    return this.dataSource.getRepository(Operativo)
  }

  async crearOperativo(operativo: Operativo): Promise<Operativo> {
    return this.operativoRepo.save(operativo)
  }

  async listar(paginacion: PaginacionQueryDto): Promise<[Operativo[], number]> {
    return this.operativoRepo.findAndCount({
      order: { fechaOperativo: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async buscarPorId(id: string): Promise<Operativo | null> {
    return this.operativoRepo.findOne({ where: { id } })
  }

  async buscarPorCaso(idCaso: string): Promise<Operativo[]> {
    return this.operativoRepo.find({
      where: { idCaso },
      order: { fechaOperativo: 'DESC' },
    })
  }

  async buscarPorNumeroOperativo(
    numeroOperativo: string
  ): Promise<Operativo | null> {
    return this.operativoRepo.findOne({ where: { numeroOperativo } })
  }

  async resolverPorCaso(idCaso: string): Promise<Operativo | null> {
    return this.operativoRepo.findOne({
      where: { idCaso },
      order: { fechaOperativo: 'DESC' },
    })
  }

  async actualizarOperativo(operativo: Operativo): Promise<Operativo> {
    return this.operativoRepo.save(operativo)
  }

  // ==================== DROGAS ====================

  private get drogaRepo() {
    return this.dataSource.getRepository(Droga)
  }

  async crearDroga(droga: Droga): Promise<Droga> {
    return this.drogaRepo.save(droga)
  }

  async listarDrogasPorOperativo(idOperativo: string, paginacion: PaginacionQueryDto): Promise<[Droga[], number]> {
    return this.drogaRepo.findAndCount({
      where: { idOperativo },
      relations: ['estadoDroga', 'estadoDroga.tipoDroga', 'formaTransporte', 'paisProcedencia', 'paisDestino'],
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
    return this.sustanciaSolidaRepo.save(sustancia)
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
    return this.sustanciaLiquidaRepo.save(sustancia)
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
    return this.fabricaRepo.save(fabrica)
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
    return this.bienRepo.save(bien)
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
    return this.bienCaracteristicaRepo.save(caracteristica)
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

  // ==================== DETENIDOS ====================

  private get detenidoRepo() {
    return this.dataSource.getRepository(DetenidoAuxiliar)
  }

  async crearDetenido(detenido: DetenidoAuxiliar): Promise<DetenidoAuxiliar> {
    return this.detenidoRepo.save(detenido)
  }

  async listarDetenidosPorOperativo(
    idOperativo: string,
    paginacion: PaginacionQueryDto
  ): Promise<[DetenidoAuxiliar[], number]> {
    return this.detenidoRepo.findAndCount({
      where: { idOperativo },
      relations: ['paisNacionalidad', 'tipoDocumento'],
      order: { fechaHoraIngreso: 'DESC' },
      skip: paginacion.saltar,
      take: paginacion.limite,
    })
  }

  async eliminarDetenido(id: string): Promise<void> {
    await this.detenidoRepo.delete(id)
  }

  async actualizarFotoDetenido(
    id: string,
    campo: 'foto_frente' | 'foto_documento' | 'foto_perfil_izquierdo',
    foto: Buffer
  ): Promise<void> {
    await this.detenidoRepo.update(id, { [campo]: foto } as any)
  }

  // ==================== GALERÍA ====================

  private get galeriaRepo() {
    return this.dataSource.getRepository(Galeria)
  }

  async crearGaleria(galeria: Galeria): Promise<Galeria> {
    return this.galeriaRepo.save(galeria)
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
    return this.logotipoRepo.save(logotipo)
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

  // ==================== CATÁLOGOS ====================

  async listarEstadosDrogaPorTipo(idTipoDroga: number): Promise<EstadoDroga[]> {
    return this.dataSource.getRepository(EstadoDroga).find({
      where: { idTipoDroga },
    })
  }

  async listarFabricaModelosPorTipo(
    idTipoFabrica: number
  ): Promise<FabricaModelo[]> {
    return this.dataSource.getRepository(FabricaModelo).find({
      where: { idTipoFabrica },
    })
  }

  async listarItemsOperativoPorCategoria(
    idCategoriaOperativo: number
  ): Promise<ItemOperativo[]> {
    return this.dataSource.getRepository(ItemOperativo).find({
      where: { idCategoriaOperativo },
    })
  }

  async listarCatalogoClasesPorBien(idBien: number): Promise<CatalogoClase[]> {
    return this.dataSource.getRepository(CatalogoClase).find({
      where: { idBien },
    })
  }

  async listarCatalogoTiposPorClase(
    idCatalogoClase: number
  ): Promise<CatalogoTipo[]> {
    return this.dataSource.getRepository(CatalogoTipo).find({
      where: { idCatalogoClase },
    })
  }

  async listarCatalogoCaracteristicasPorClase(
    idCatalogoClase: number
  ): Promise<CatalogoCaracteristica[]> {
    return this.dataSource.getRepository(CatalogoCaracteristica).find({
      where: { idCatalogoClase },
    })
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
      this.detenidoRepo.count({ where: { idOperativo } }),
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

  async buscarDetenidoPorId(id: string): Promise<DetenidoAuxiliar | null> {
    return this.detenidoRepo.findOne({ where: { id } })
  }

  async buscarBienPorId(id: string): Promise<ItemBienSecuestrado | null> {
    return this.bienRepo.findOne({ where: { id } })
  }

  async buscarLogotipoPorId(id: string): Promise<Logotipo | null> {
    return this.logotipoRepo.findOne({ where: { id } })
  }
}
