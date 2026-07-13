import { Injectable, NotFoundException } from '@nestjs/common'
import { BlancoRepository } from '../repository/blanco.repository'
import { S2iBlanco } from '../entity/blanco.entity'
import { S2iAntecedenteBlanco } from '../entity/antecedente-blanco.entity'
import { S2iRedSocial } from '../entity/red-social.entity'
import { S2iLugarBlanco } from '../entity/lugar-blanco.entity'
import { S2iArchivoBlanco } from '../entity/archivo-blanco.entity'
import { S2iFlujoTelefonico } from '../entity/flujo-telefonico.entity'
import { S2iFlujoFiscalia } from '../entity/flujo-fiscalia.entity'
import { S2iActivoPatrimonial } from '../entity/activo-patrimonial.entity'
import { S2iOvise } from '../entity/ovise.entity'
import {
  CreateBlancoDto,
  CreateAntecedenteDto,
  CreateRedSocialDto,
  CreateLugarSigDto,
  CreateArchivoDto,
  CreateFlujoTelefonicoDto,
  CreateFlujoFiscaliaDto,
  CreateActivoPatrimonialDto,
  CreateOviseDto,
} from '../dto'

/**
 * Servicio de gestión de blancos (personas investigadas)
 * Replica la lógica de FRM_ING_ENT1 del sistema legado:
 *   - RegBlancos.InsertBlancos
 *   - RegBlancos.Insertantecedente
 *   - RegBlancos.InsertRedSocial
 *   - RegBlancos.InsertSig
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
      numeroDocumento: dto.numeroDocumento.trim(),
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
    dto: CreateAntecedenteDto,
    usuario: string
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
      usuario: usuario.trim(),
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
    dto: CreateRedSocialDto,
    usuario: string
  ): Promise<S2iRedSocial> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const red = new S2iRedSocial({
      idBlanco,
      tipoRed: dto.tipoRed.trim(),
      direccion: dto.direccion.trim(),
      usuario: usuario.trim(),
    })
    return this.repo.crearRedSocial(red)
  }

  async listarRedesSociales(idBlanco: string): Promise<S2iRedSocial[]> {
    return this.repo.listarRedesPorBlanco(idBlanco)
  }

  async eliminarRedSocial(idRedSocial: string): Promise<void> {
    await this.repo.eliminarRedSocial(idRedSocial)
  }

  // ==================== SIG ====================

  async crearLugar(
    idBlanco: string,
    dto: CreateLugarSigDto,
    usuario: string
  ): Promise<S2iLugarBlanco> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const lugar = new S2iLugarBlanco({
      idBlanco,
      descripcion: dto.descripcion.trim().toUpperCase(),
      coordenadasX: dto.coordenadasX,
      coordenadasY: dto.coordenadasY,
      contenido: dto.contenido.trim(),
      usuario: usuario.trim(),
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
    data: Buffer,
    usuario: string
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
      usuario: usuario.trim(),
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

  // ==================== FLUJO TELEFÓNICO ====================

  /**
   * Crea un flujo telefónico para un blanco.
   * usuarioCreacion/fechaCreacion son gestionados por el trigger de BD
   * fn_auditoria_before_insert; solo se envía el ID numérico del usuario autenticado.
   */
  async crearFlujoTelefonico(
    idBlanco: string,
    dto: CreateFlujoTelefonicoDto,
    idUsuario: string
  ): Promise<S2iFlujoTelefonico> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const flujo = new S2iFlujoTelefonico({
      idBlanco,
      empresa: dto.empresa.trim(),
      direccion: dto.direccion.trim(),
      numero: dto.numero.trim(),
      usuarioCreacion: idUsuario,
    })
    return this.repo.crearFlujoTelefonico(flujo)
  }

  async listarFlujosTelefonicos(
    idBlanco: string
  ): Promise<S2iFlujoTelefonico[]> {
    return this.repo.listarFlujosPorBlanco(idBlanco)
  }

  async eliminarFlujoTelefonico(idFlujo: string): Promise<void> {
    await this.repo.eliminarFlujoTelefonico(idFlujo)
  }

  // ==================== FLUJO FISCALÍA ====================

  async crearFlujoFiscalia(
    idFlujo: string,
    dto: CreateFlujoFiscaliaDto,
    idUsuario: string
  ): Promise<S2iFlujoFiscalia> {
    const existe = await this.repo.buscarFlujoPorId(idFlujo)
    if (!existe) throw new NotFoundException(`Flujo telefónico ${idFlujo} no encontrado`)

    const flujoFiscalia = new S2iFlujoFiscalia({
      idFlujo,
      servicio: dto.servicio.trim(),
      registro: dto.registro.trim(),
      numeroA: dto.numeroA.trim(),
      imeiA: dto.imeiA.trim(),
      rbsA: dto.rbsA.trim(),
      celdaA: dto.celdaA.trim(),
      latA: dto.latA,
      lonA: dto.lonA,
      numeroB: dto.numeroB.trim(),
      titular: dto.titular.trim(),
      imeiB: dto.imeiB.trim(),
      rbsB: dto.rbsB.trim(),
      celdaB: dto.celdaB.trim(),
      latB: dto.latB,
      lonB: dto.lonB,
      fechaHora: new Date(dto.fechaHora),
      duracion: dto.duracion.trim(),
      usuarioCreacion: idUsuario,
    })
    return this.repo.crearFlujoFiscalia(flujoFiscalia)
  }

  async listarFlujoFiscalia(idFlujo: string): Promise<S2iFlujoFiscalia[]> {
    return this.repo.listarFlujoFiscaliaPorFlujo(idFlujo)
  }

  async eliminarFlujoFiscalia(idFlujoFiscalia: string): Promise<void> {
    await this.repo.eliminarFlujoFiscalia(idFlujoFiscalia)
  }

  // ==================== ACTIVO PATRIMONIAL ====================

  async subirActivoPatrimonial(
    idBlanco: string,
    dto: CreateActivoPatrimonialDto,
    archivo: Buffer,
    idUsuario: string
  ): Promise<any> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const activo = new S2iActivoPatrimonial({
      idBlanco,
      idTipoActivo: dto.idTipoActivo,
      gestion: dto.gestion.trim(),
      contenido: dto.contenido.trim(),
      archivo,
      usuarioCreacion: idUsuario,
    })
    const saved = await this.repo.crearActivoPatrimonial(activo)
    const { archivo: _archivo, ...resto } = saved
    return resto
  }

  async listarActivosPatrimoniales(idBlanco: string): Promise<any[]> {
    const activos = await this.repo.listarActivosPorBlanco(idBlanco)
    return activos.map(({ tipoActivo, ...a }) => ({
      ...a,
      descripcionTipoActivo: tipoActivo?.descripcion ?? null,
    }))
  }

  async descargarActivoPatrimonial(
    idActivoPatrimonial: string
  ): Promise<Buffer> {
    const activo = await this.repo.buscarActivoPorId(idActivoPatrimonial)
    if (!activo)
      throw new NotFoundException(
        `Activo patrimonial ${idActivoPatrimonial} no encontrado`
      )
    return activo.archivo
  }

  async eliminarActivoPatrimonial(idActivoPatrimonial: string): Promise<void> {
    await this.repo.eliminarActivoPatrimonial(idActivoPatrimonial)
  }

  // ==================== OVISE ====================

  async crearOvise(
    idBlanco: string,
    dto: CreateOviseDto,
    idUsuario: string
  ): Promise<S2iOvise> {
    const existe = await this.repo.buscarPorId(idBlanco)
    if (!existe) throw new NotFoundException(`Blanco ${idBlanco} no encontrado`)

    const ovise = new S2iOvise({
      idBlanco,
      lugar: dto.lugar.trim().toUpperCase(),
      latitud: dto.latitud,
      longitud: dto.longitud,
      reporte: dto.reporte.trim(),
      accion: dto.accion.trim().toUpperCase(),
      usuarioCreacion: idUsuario,
    })
    return this.repo.crearOvise(ovise)
  }

  async listarOvise(idBlanco: string): Promise<S2iOvise[]> {
    return this.repo.listarOvisePorBlanco(idBlanco)
  }

  async eliminarOvise(idOvise: string): Promise<void> {
    await this.repo.eliminarOvise(idOvise)
  }
}
