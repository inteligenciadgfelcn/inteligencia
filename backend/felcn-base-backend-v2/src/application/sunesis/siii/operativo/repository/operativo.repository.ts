import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'

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

  async listar(): Promise<Operativo[]> {
    return this.operativoRepo
      .createQueryBuilder('operativo')
      .orderBy('operativo.fechaOperativo', 'DESC')
      .getMany()
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

  async listarDrogasPorOperativo(idOperativo: string): Promise<Droga[]> {
    return this.drogaRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
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
    idOperativo: string
  ): Promise<SustanciaSolida[]> {
    return this.sustanciaSolidaRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
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
    idOperativo: string
  ): Promise<SustanciaLiquida[]> {
    return this.sustanciaLiquidaRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
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

  async listarFabricasPorOperativo(idOperativo: string): Promise<Fabrica[]> {
    return this.fabricaRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
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
    idOperativo: string
  ): Promise<ItemBienSecuestrado[]> {
    return this.bienRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
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
    idItemBienSecuestrado: string
  ): Promise<ItemBienCaracteristica[]> {
    return this.bienCaracteristicaRepo.find({
      where: { idItemBienSecuestrado },
      order: { fechaHoraIngreso: 'DESC' },
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
    idOperativo: string
  ): Promise<DetenidoAuxiliar[]> {
    return this.detenidoRepo.find({
      where: { idOperativo },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async eliminarDetenido(id: string): Promise<void> {
    await this.detenidoRepo.delete(id)
  }

  // ==================== GALERÍA ====================

  private get galeriaRepo() {
    return this.dataSource.getRepository(Galeria)
  }

  async crearGaleria(galeria: Galeria): Promise<Galeria> {
    return this.galeriaRepo.save(galeria)
  }

  async listarGaleriaPorOperativo(idOperativo: string): Promise<Galeria[]> {
    return this.galeriaRepo.find({
      where: { idOperativo },
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

  async listarLogotiposPorOperativo(idOperativo: string): Promise<Logotipo[]> {
    return this.logotipoRepo.find({
      where: { idOperativo },
    })
  }

  async listarLogotiposPorDroga(idDroga: string): Promise<Logotipo[]> {
    return this.logotipoRepo.find({
      where: { idDroga },
      order: { fechaHoraIngreso: 'DESC' },
    })
  }

  async eliminarLogotiposPorDroga(idDroga: string): Promise<void> {
    await this.logotipoRepo.delete({ idDroga })
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
      cantidadLogotipos,
    ] = await Promise.all([
      this.drogaRepo.count({ where: { idOperativo } }),
      this.sustanciaSolidaRepo.count({ where: { idOperativo } }),
      this.sustanciaLiquidaRepo.count({ where: { idOperativo } }),
      this.fabricaRepo.count({ where: { idOperativo } }),
      this.bienRepo.count({ where: { idOperativo } }),
      this.detenidoRepo.count({ where: { idOperativo } }),
      this.galeriaRepo.count({ where: { idOperativo } }),
      this.logotipoRepo.count({ where: { idOperativo } }),
    ])

    return {
      drogas: cantidadDrogas,
      sustanciasSolidas: cantidadSustanciasSolidas,
      sustanciasLiquidas: cantidadSustanciasLiquidas,
      fabricas: cantidadFabricas,
      bienes: cantidadBienes,
      detenidos: cantidadDetenidos,
      galeria: cantidadGaleria,
      logotipos: cantidadLogotipos,
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
