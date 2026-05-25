import { Injectable, NotFoundException } from '@nestjs/common'
import { BlancoRepository } from '../repository/blanco.repository'
import { S2iBlanco } from '../entity/blanco.entity'
import { S2iAntecedenteBlanco } from '../entity/antecedente-blanco.entity'
import { S2iRedSocial } from '../entity/red-social.entity'
import { S2iLugarBlanco } from '../entity/lugar-blanco.entity'
import { S2iArchivoBlanco } from '../entity/archivo-blanco.entity'
import {
  CreateBlancoDto,
  CreateAntecedenteDto,
  CreateRedSocialDto,
  CreateLugarGisDto,
  CreateArchivoDto,
} from '../dto'

/**
 * Servicio de gestión de blancos (personas investigadas)
 * Replica la lógica de FRM_ING_ENT1 del sistema legado:
 *   - RegBlancos.InsertBlancos
 *   - RegBlancos.Insertantecedente
 *   - RegBlancos.InsertRedSocial
 *   - RegBlancos.InsertGis
 *   - Carga/eliminación de archivos (ArchivosBlanco)
 */
@Injectable()
export class BlancoService {
  constructor(private readonly repo: BlancoRepository) {}

  // ==================== BLANCOS ====================

  /** Crea un blanco para un caso. Aplica .toUpperCase() en nombres y apellidos. */
  async crear(
    idCaso: string,
    dto: CreateBlancoDto,
    usuario: string
  ): Promise<S2iBlanco> {
    const blanco = new S2iBlanco({
      idCaso,
      deNombres: dto.deNombres.trim().toUpperCase(),
      dePaterno: dto.dePaterno.trim().toUpperCase(),
      deMaterno: dto.deMaterno?.trim().toUpperCase() || '*',
      deEsposo: dto.deEsposo?.trim().toUpperCase() || '*',
      idPais: dto.idPais,
      alias: dto.alias?.trim().toUpperCase() || '*',
      usuario: usuario.trim(),
    })
    return this.repo.crear(blanco)
  }

  async listarPorCaso(idCaso: string): Promise<any[]> {
    const blancos = await this.repo.listarPorCaso(idCaso)
    return blancos.map(({ foto, pais, ...b }) => ({
      ...b,
      descripcionPais: pais?.descripcion ?? null,
    }))
  }

  async eliminar(idBlanco: string): Promise<void> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)
    await this.repo.eliminar(idBlanco)
  }

  async actualizarFoto(idBlanco: string, foto: Buffer): Promise<void> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)
    await this.repo.actualizarFoto(idBlanco, foto)
  }

  async obtenerFoto(idBlanco: string): Promise<Buffer> {
    const foto = await this.repo.buscarFoto(idBlanco)
    if (!foto) return Buffer.alloc(0)
    return foto
  }

  // ==================== ANTECEDENTES ====================

  async crearAntecedente(
    idBlanco: string,
    dto: CreateAntecedenteDto
  ): Promise<S2iAntecedenteBlanco> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const antecedente = new S2iAntecedenteBlanco({
      idBlanco,
      idTipoDelito: dto.idTipoDelito,
      idPais: dto.idPais,
      lugarHecho: dto.lugarHecho.trim(),
      nroCaso: dto.nroCaso.trim().toUpperCase(),
      fechaHecho: new Date(dto.fechaHecho),
      hecho: dto.hecho.trim(),
    })
    return this.repo.crearAntecedente(antecedente)
  }

  async listarAntecedentes(idBlanco: string): Promise<any[]> {
    const datos = await this.repo.listarAntecedentesPorBlanco(idBlanco)
    return datos.map(({ tipoDelito, pais, blanco, ...a }) => ({
      ...a,
      descripcionTipoDelito: tipoDelito?.descripcion ?? null,
      descripcionPais: pais?.descripcion ?? null,
    }))
  }

  async eliminarAntecedente(idAntecedente: string): Promise<void> {
    await this.repo.eliminarAntecedente(idAntecedente)
  }

  // ==================== REDES SOCIALES ====================

  async crearRedSocial(
    idBlanco: string,
    dto: CreateRedSocialDto
  ): Promise<S2iRedSocial> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const red = new S2iRedSocial({
      idBlanco,
      tipoRed: dto.tipoRed.trim(),
      direccion: dto.direccion.trim(),
    })
    return this.repo.crearRedSocial(red)
  }

  async listarRedesSociales(idBlanco: string): Promise<S2iRedSocial[]> {
    return this.repo.listarRedesPorBlanco(idBlanco)
  }

  async eliminarRedSocial(idRedSocial: string): Promise<void> {
    await this.repo.eliminarRedSocial(idRedSocial)
  }

  // ==================== GIS ====================

  async crearLugar(
    idBlanco: string,
    dto: CreateLugarGisDto
  ): Promise<S2iLugarBlanco> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const lugar = new S2iLugarBlanco({
      idBlanco,
      descripcion: dto.descripcion.trim().toUpperCase(),
      coordenadasX: dto.coordenadasX,
      coordenadasY: dto.coordenadasY,
      contenido: dto.contenido.trim(),
    })
    return this.repo.crearLugar(lugar)
  }

  async listarLugares(idBlanco: string): Promise<S2iLugarBlanco[]> {
    return this.repo.listarLugaresPorBlanco(idBlanco)
  }

  async eliminarLugar(idLugarBlanco: string): Promise<void> {
    await this.repo.eliminarLugar(idLugarBlanco)
  }

  // ==================== ARCHIVOS ====================

  async subirArchivo(
    idBlanco: string,
    dto: CreateArchivoDto,
    nombreArchivo: string,
    data: Buffer
  ): Promise<any> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const archivo = new S2iArchivoBlanco({
      idBlanco,
      idContenidoCaso: dto.idContenidoCaso,
      tipo: dto.tipo.trim(),
      nombre: dto.nombre.trim().toUpperCase(),
      nombreArchivo: nombreArchivo.trim(),
      data,
    })
    const saved = await this.repo.crearArchivo(archivo)
    const { data: _data, ...resto } = saved
    return resto
  }

  async listarArchivos(idBlanco: string): Promise<any[]> {
    const archivos = await this.repo.listarArchivosPorBlanco(idBlanco)
    return archivos.map(({ data, contenidoCaso, ...a }) => ({
      ...a,
      descripcionContenido: contenidoCaso?.descripcion ?? null,
    }))
  }

  async descargarArchivo(
    idArchivo: string
  ): Promise<{ data: Buffer; nombreArchivo: string }> {
    const archivo = await this.repo.buscarArchivoPorId(idArchivo)
    if (!archivo)
      throw new NotFoundException(`Archivo ${idArchivo} no encontrado`)
    return { data: archivo.data, nombreArchivo: archivo.nombreArchivo }
  }

  async eliminarArchivo(idArchivo: string): Promise<void> {
    await this.repo.eliminarArchivo(idArchivo)
  }
}
