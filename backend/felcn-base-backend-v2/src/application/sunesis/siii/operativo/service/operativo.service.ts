import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { Status } from '@/common/constants'
import { OperativoRepository } from '../repository/operativo.repository'

// Entities
import { Operativo } from '../entity/operativo.entity'
import { Droga } from '../entity/droga.entity'
import { SustanciaSolida } from '../entity/sustancia-solida.entity'
import { SustanciaLiquida } from '../entity/sustancia-liquida.entity'
import { Fabrica } from '../entity/fabrica.entity'
import { ItemBienSecuestrado } from '../entity/item-bien-secuestrado.entity'
import { DetenidoAuxiliar } from '../entity/detenido-auxiliar.entity'
import { Galeria } from '../entity/galeria.entity'
import { Logotipo } from '../entity/logotipo.entity'

// DTOs
import {
  CreateOperativoDto,
  CreateDrogaDto,
  CreateDetenidoDto,
  CreateBienSecuestradoDto,
  CreateFabricaDto,
  CreateSustanciaSolidaDto,
  CreateSustanciaLiquidaDto,
  CreateGaleriaDto,
  CreateLogotipoDto,
} from '../dto'

@Injectable()
export class OperativoService extends BaseService {
  constructor(private readonly operativoRepository: OperativoRepository) {
    super()
  }

  // ==================== OPERATIVO ====================

  async crear(data: CreateOperativoDto, usuario: string): Promise<Operativo> {
    // Calcular coordenadas decimales
    const coordX = (data.gradosX + data.minX / 60 + data.segX / 3600) * -1
    const coordY = (data.gradosY + data.minY / 60 + data.segY / 3600) * -1

    const operativo = new Operativo({
      ...data,
      fechaOperativo: new Date(data.fechaOperativo),
      coordX,
      coordY,
      esRevisado: false,
      esPositivo: true,
      esAprehendido: false,
      esArrestado: false,
      esIcia: true,
      esParteDiario: false,
      usuario,
      estado: Status.ACTIVE,
    })
    return this.operativoRepository.crearOperativo(operativo)
  }

  async listar(): Promise<Operativo[]> {
    return this.operativoRepository.listar()
  }

  async buscarPorId(id: string): Promise<Operativo> {
    const operativo = await this.operativoRepository.buscarPorId(id)
    if (!operativo) {
      throw new NotFoundException(`Operativo con ID ${id} no encontrado`)
    }
    return operativo
  }

  async buscarPorCaso(idCaso: string): Promise<Operativo[]> {
    return this.operativoRepository.buscarPorCaso(idCaso)
  }

  async buscarPorNumeroOperativo(numeroOperativo: string): Promise<Operativo> {
    const operativo = await this.operativoRepository.buscarPorNumeroOperativo(numeroOperativo)
    if (!operativo) {
      throw new NotFoundException(`Operativo con número ${numeroOperativo} no encontrado`)
    }
    return operativo
  }

  async actualizar(id: string, data: Partial<Operativo>, usuarioModificacion: string): Promise<Operativo> {
    const operativo = await this.buscarPorId(id)

    // Recalcular coordenadas si cambian
    if (data.gradosX !== undefined || data.minX !== undefined || data.segX !== undefined) {
      const gx = data.gradosX ?? operativo.gradosX
      const mx = data.minX ?? operativo.minX
      const sx = data.segX ?? operativo.segX
      data.coordX = (gx + mx / 60 + sx / 3600) * -1
    }
    if (data.gradosY !== undefined || data.minY !== undefined || data.segY !== undefined) {
      const gy = data.gradosY ?? operativo.gradosY
      const my = data.minY ?? operativo.minY
      const sy = data.segY ?? operativo.segY
      data.coordY = (gy + my / 60 + sy / 3600) * -1
    }

    Object.assign(operativo, data, { usuarioModificacion })
    return this.operativoRepository.actualizarOperativo(operativo)
  }

  async inactivar(id: string, usuarioModificacion: string): Promise<Operativo> {
    const operativo = await this.buscarPorId(id)
    operativo.estado = Status.INACTIVE
    operativo.usuarioModificacion = usuarioModificacion
    return this.operativoRepository.actualizarOperativo(operativo)
  }

  // ==================== DROGAS ====================

  async agregarDroga(idOperativo: string, data: CreateDrogaDto, usuario: string): Promise<Droga> {
    await this.buscarPorId(idOperativo) // Verificar que existe
    const droga = new Droga({
      idOperativo,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearDroga(droga)
  }

  async listarDrogas(idOperativo: string): Promise<Droga[]> {
    return this.operativoRepository.listarDrogasPorOperativo(idOperativo)
  }

  async eliminarDroga(idOperativo: string, idDroga: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarDroga(idDroga)
  }

  async obtenerPesajeDrogas(idOperativo: string): Promise<any> {
    return this.operativoRepository.obtenerResumenDrogas(idOperativo)
  }

  // ==================== SUSTANCIAS SÓLIDAS ====================

  async agregarSustanciaSolida(idOperativo: string, data: CreateSustanciaSolidaDto, usuario: string): Promise<SustanciaSolida> {
    await this.buscarPorId(idOperativo)
    const sustancia = new SustanciaSolida({
      idOperativo,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearSustanciaSolida(sustancia)
  }

  async listarSustanciasSolidas(idOperativo: string): Promise<SustanciaSolida[]> {
    return this.operativoRepository.listarSustanciasSolidasPorOperativo(idOperativo)
  }

  async eliminarSustanciaSolida(idOperativo: string, idSustancia: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarSustanciaSolida(idSustancia)
  }

  // ==================== SUSTANCIAS LÍQUIDAS ====================

  async agregarSustanciaLiquida(idOperativo: string, data: CreateSustanciaLiquidaDto, usuario: string): Promise<SustanciaLiquida> {
    await this.buscarPorId(idOperativo)
    const sustancia = new SustanciaLiquida({
      idOperativo,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearSustanciaLiquida(sustancia)
  }

  async listarSustanciasLiquidas(idOperativo: string): Promise<SustanciaLiquida[]> {
    return this.operativoRepository.listarSustanciasLiquidasPorOperativo(idOperativo)
  }

  async eliminarSustanciaLiquida(idOperativo: string, idSustancia: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarSustanciaLiquida(idSustancia)
  }

  // ==================== FÁBRICAS ====================

  async agregarFabrica(idOperativo: string, data: CreateFabricaDto, usuario: string): Promise<Fabrica> {
    await this.buscarPorId(idOperativo)
    const fabrica = new Fabrica({
      idOperativo,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearFabrica(fabrica)
  }

  async listarFabricas(idOperativo: string): Promise<Fabrica[]> {
    return this.operativoRepository.listarFabricasPorOperativo(idOperativo)
  }

  async eliminarFabrica(idOperativo: string, idFabrica: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarFabrica(idFabrica)
  }

  // ==================== BIENES SECUESTRADOS ====================

  async agregarBien(idOperativo: string, data: CreateBienSecuestradoDto, usuario: string): Promise<ItemBienSecuestrado> {
    await this.buscarPorId(idOperativo)
    const bien = new ItemBienSecuestrado({
      idOperativo,
      ...data,
      usuario,
    })
    return this.operativoRepository.crearBien(bien)
  }

  async listarBienes(idOperativo: string): Promise<ItemBienSecuestrado[]> {
    return this.operativoRepository.listarBienesPorOperativo(idOperativo)
  }

  async eliminarBien(idOperativo: string, idBien: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarBien(idBien)
  }

  // ==================== DETENIDOS ====================

  async agregarDetenido(idOperativo: string, data: CreateDetenidoDto, usuario: string): Promise<DetenidoAuxiliar> {
    await this.buscarPorId(idOperativo)
    const detenido = new DetenidoAuxiliar({
      idOperativo,
      ...data,
      fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
      apellidoMaterno: data.apellidoMaterno || '*',
      apellidoEsposo: data.apellidoEsposo || '*',
      serie: data.serie || '',
      seccion: data.seccion || '',
      observaciones: data.observaciones || '',
      esActual: true,
      esRevisionIcia: false,
      tieneTarjeta: false,
      estaVivo: true,
      observacionesAdicionales: '',
      usuario,
      usuarioActualizacion: usuario,
    })
    return this.operativoRepository.crearDetenido(detenido)
  }

  async listarDetenidos(idOperativo: string): Promise<DetenidoAuxiliar[]> {
    return this.operativoRepository.listarDetenidosPorOperativo(idOperativo)
  }

  async eliminarDetenido(idOperativo: string, idDetenido: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarDetenido(idDetenido)
  }

  // ==================== GALERÍA ====================

  async agregarFotoGaleria(idOperativo: string, data: CreateGaleriaDto, foto: Buffer, usuario: string): Promise<Galeria> {
    await this.buscarPorId(idOperativo)
    const galeria = new Galeria({
      idOperativo,
      descripcion: data.descripcion,
      foto,
    })
    return this.operativoRepository.crearGaleria(galeria)
  }

  async listarGaleria(idOperativo: string): Promise<Galeria[]> {
    return this.operativoRepository.listarGaleriaPorOperativo(idOperativo)
  }

  async eliminarFotoGaleria(idOperativo: string, idGaleria: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarGaleria(idGaleria)
  }

  // ==================== LOGOTIPOS ====================

  async agregarLogotipo(idOperativo: string, data: CreateLogotipoDto, fotografia: Buffer, usuario: string): Promise<Logotipo> {
    await this.buscarPorId(idOperativo)
    const logotipo = new Logotipo({
      idOperativo,
      numeroCaso: data.numeroCaso,
      numeroOperativo: data.numeroOperativo,
      fechaOperativo: new Date(data.fechaOperativo),
      nombreCaso: data.nombreCaso,
      descripcion: data.descripcion,
      imagen: data.imagen,
      descripcionLogo: data.descripcionLogo,
      idTipoDroga: data.idTipoDroga,
      idPaisOrigen: data.idPaisOrigen,
      idPaisDestino: data.idPaisDestino,
      organizacion: data.organizacion,
      blanco: data.blanco || '',
      observacion: data.observacion || '',
      enlace: data.enlace || '',
      fotografia,
      usuario,
    })
    return this.operativoRepository.crearLogotipo(logotipo)
  }

  async listarLogotipos(idOperativo: string): Promise<Logotipo[]> {
    return this.operativoRepository.listarLogotiposPorOperativo(idOperativo)
  }

  async eliminarLogotipo(idOperativo: string, idLogotipo: string): Promise<void> {
    await this.buscarPorId(idOperativo)
    await this.operativoRepository.eliminarLogotipo(idLogotipo)
  }

  // ==================== CATÁLOGOS ====================

  async listarEstadosDroga(idTipoDroga: number) {
    return this.operativoRepository.listarEstadosDrogaPorTipo(idTipoDroga)
  }

  async listarFabricaModelos(idTipoFabrica: number) {
    return this.operativoRepository.listarFabricaModelosPorTipo(idTipoFabrica)
  }

  async listarItemsOperativo(idCategoriaOperativo: number) {
    return this.operativoRepository.listarItemsOperativoPorCategoria(idCategoriaOperativo)
  }

  async listarCatalogoClases(idBien: number) {
    return this.operativoRepository.listarCatalogoClasesPorBien(idBien)
  }

  async listarCatalogoTipos(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoTiposPorClase(idCatalogoClase)
  }

  async listarCatalogoCaracteristicas(idCatalogoClase: number) {
    return this.operativoRepository.listarCatalogoCaracteristicasPorClase(idCatalogoClase)
  }

  // ==================== OPERATIVO COMPLETO ====================

  async obtenerOperativoCompleto(id: string): Promise<any> {
    const operativo = await this.buscarPorId(id)
    const [drogas, sustanciasSolidas, sustanciasLiquidas, fabricas, bienes, detenidos, galeria, logotipos] = await Promise.all([
      this.listarDrogas(id),
      this.listarSustanciasSolidas(id),
      this.listarSustanciasLiquidas(id),
      this.listarFabricas(id),
      this.listarBienes(id),
      this.listarDetenidos(id),
      this.listarGaleria(id),
      this.listarLogotipos(id),
    ])

    return {
      operativo,
      drogas,
      sustanciasSolidas,
      sustanciasLiquidas,
      fabricas,
      bienes,
      detenidos,
      galeria,
      logotipos,
    }
  }
}
