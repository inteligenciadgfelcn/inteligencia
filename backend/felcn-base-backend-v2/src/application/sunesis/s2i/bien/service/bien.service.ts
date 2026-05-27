import { Injectable, NotFoundException } from '@nestjs/common'
import { BienRepository } from '../repository/bien.repository'
import { S2iItemBienInvestigado } from '../entity/item-bien-investigado.entity'
import { S2iItemBienCaracteristica } from '../entity/item-bien-caracteristica.entity'
import { S2iLugarBien } from '../entity/lugar-bien.entity'
import { S2iArchivoBien } from '../entity/archivo-bien.entity'
import { CreateBienInvestigadoDto, CreateBienCaracteristicaDto } from '../dto'
import { CreateLugarSigDto } from '../../blanco/dto/create-lugar-sig.dto'
import { CreateArchivoDto } from '../../blanco/dto/create-archivo.dto'

/**
 * Servicio de gestión de bienes investigados
 * Replica la lógica de FRM_ING_ENT3 del sistema legado:
 *   - RegBienes.InsertBienes
 *   - RegBienes.InsertCaracteristicas
 *   - RegBienes.InsertSig
 *   - Archivos (ArchivosBien)
 */
@Injectable()
export class BienService {
  constructor(private readonly repo: BienRepository) {}

  // ==================== BIENES INVESTIGADOS ====================

  /** Crea un bien investigado para un caso. */
  async crear(
    idCaso: string,
    dto: CreateBienInvestigadoDto,
    usuario: string
  ): Promise<S2iItemBienInvestigado> {
    const bien = new S2iItemBienInvestigado({
      idCaso,
      idCatalogoTipo: dto.idCatalogoTipo,
      idTipoInvestigacionBien: dto.idTipoInvestigacionBien,
      usuario: usuario.trim(),
    })
    return this.repo.crear(bien)
  }

  async listarPorCaso(idCaso: string): Promise<any[]> {
    const datos = await this.repo.listarPorCaso(idCaso)
    return datos.map(({ catalogoTipo, tipoInvestigacionBien, ...b }) => ({
      ...b,
      descripcionTipo: catalogoTipo?.descripcion ?? null,
      descripcionClase: catalogoTipo?.catalogoClase?.descripcion ?? null,
      descripcionBien: catalogoTipo?.catalogoClase?.bien?.descripcion ?? null,
      descripcionTipoInvestigacion: tipoInvestigacionBien?.descripcion ?? null,
    }))
  }

  async buscarPorId(
    idItemBienSecundario: string
  ): Promise<S2iItemBienInvestigado> {
    const bien = await this.repo.buscarPorId(idItemBienSecundario)
    if (!bien)
      throw new NotFoundException(`Bien ${idItemBienSecundario} no encontrado`)
    return bien
  }

  async eliminar(idItemBienSecundario: string): Promise<void> {
    const existe = await this.repo.buscarPorId(idItemBienSecundario)
    if (!existe)
      throw new NotFoundException(`Bien ${idItemBienSecundario} no encontrado`)
    await this.repo.eliminar(idItemBienSecundario)
  }

  // ==================== CARACTERÍSTICAS ====================

  async crearCaracteristica(
    idItemBienSecundario: string,
    dto: CreateBienCaracteristicaDto,
    usuario: string
  ): Promise<S2iItemBienCaracteristica> {
    const existe = await this.repo.buscarPorId(idItemBienSecundario)
    if (!existe)
      throw new NotFoundException(`Bien ${idItemBienSecundario} no encontrado`)

    const caracteristica = new S2iItemBienCaracteristica({
      idItemBienSecundario,
      idCatalogoCaracteristica: dto.idCatalogoCaracteristica,
      descripcion: dto.descripcion.trim(),
      usuario: usuario.trim(),
    })
    return this.repo.crearCaracteristica(caracteristica)
  }

  async listarCaracteristicas(idItemBienSecundario: string): Promise<any[]> {
    const datos =
      await this.repo.listarCaracteristicasPorBien(idItemBienSecundario)
    return datos.map(({ catalogoCaracteristica, ...c }) => ({
      ...c,
      descripcionCaracteristica: catalogoCaracteristica?.descripcion ?? null,
    }))
  }

  async eliminarCaracteristica(
    idItemBienCaracteristica: number
  ): Promise<void> {
    await this.repo.eliminarCaracteristica(idItemBienCaracteristica)
  }

  async listarCaracteristicasDisponibles(idItemBienSecundario: string) {
    return this.repo.listarCaracteristicasDisponibles(idItemBienSecundario)
  }

  // ==================== SIG ====================

  async crearLugar(
    idItemBienSecundario: string,
    dto: CreateLugarSigDto,
    usuario: string
  ): Promise<S2iLugarBien> {
    const existe = await this.repo.buscarPorId(idItemBienSecundario)
    if (!existe)
      throw new NotFoundException(`Bien ${idItemBienSecundario} no encontrado`)

    const lugar = new S2iLugarBien({
      idItemBienSecundario,
      descripcion: dto.descripcion.trim().toUpperCase(),
      coordenadasX: dto.coordenadasX,
      coordenadasY: dto.coordenadasY,
      contenido: dto.contenido.trim(),
      usuario: usuario.trim(),
    })
    return this.repo.crearLugar(lugar)
  }

  async listarLugares(idItemBienSecundario: string): Promise<S2iLugarBien[]> {
    return this.repo.listarLugaresPorBien(idItemBienSecundario)
  }

  async eliminarLugar(idLugarBien: string): Promise<void> {
    await this.repo.eliminarLugar(idLugarBien)
  }

  // ==================== ARCHIVOS ====================

  async subirArchivo(
    idItemBienSecundario: string,
    dto: CreateArchivoDto,
    nombreArchivo: string,
    data: Buffer,
    usuario: string
  ): Promise<any> {
    const existe = await this.repo.buscarPorId(idItemBienSecundario)
    if (!existe)
      throw new NotFoundException(`Bien ${idItemBienSecundario} no encontrado`)

    const archivo = new S2iArchivoBien({
      idItemBienSecundario,
      idContenidoCaso: dto.idContenidoCaso,
      tipo: dto.tipo.trim(),
      nombre: dto.nombre.trim().toUpperCase(),
      nombreArchivo: nombreArchivo.trim(),
      data,
      usuario: usuario.trim(),
    })
    const saved = await this.repo.crearArchivo(archivo)
    const { data: _data, ...resto } = saved
    return resto
  }

  async listarArchivos(idItemBienSecundario: string): Promise<any[]> {
    const archivos = await this.repo.listarArchivosPorBien(idItemBienSecundario)
    return archivos.map(({ data, contenidoCaso, ...a }) => ({
      ...a,
      descripcionContenido: contenidoCaso?.descripcion ?? null,
    }))
  }

  async descargarArchivo(
    idArchivoBien: string
  ): Promise<{ data: Buffer; nombreArchivo: string }> {
    const archivo = await this.repo.buscarArchivoPorId(idArchivoBien)
    if (!archivo)
      throw new NotFoundException(`Archivo ${idArchivoBien} no encontrado`)
    return { data: archivo.data, nombreArchivo: archivo.nombreArchivo }
  }

  async eliminarArchivo(idArchivoBien: string): Promise<void> {
    await this.repo.eliminarArchivo(idArchivoBien)
  }
}
