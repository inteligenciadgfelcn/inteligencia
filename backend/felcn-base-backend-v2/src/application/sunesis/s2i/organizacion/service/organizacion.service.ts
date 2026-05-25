import { Injectable, NotFoundException } from '@nestjs/common'
import { OrganizacionRepository } from '../repository/organizacion.repository'
import { S2iEmpresa } from '../entity/empresa.entity'
import { S2iLugarEmpresa } from '../entity/lugar-empresa.entity'
import { S2iArchivoOrganizacion } from '../entity/archivo-organizacion.entity'
import { CreateOrganizacionDto } from '../dto/create-organizacion.dto'
import { CreateLugarGisDto } from '../../blanco/dto/create-lugar-gis.dto'
import { CreateArchivoDto } from '../../blanco/dto/create-archivo.dto'

/**
 * Servicio de gestión de organizaciones investigadas
 * Replica la lógica de FRM_ING_ENT2 del sistema legado:
 *   - RegOrganizacion.InsertOrganizacion
 *   - RegOrganizacion.InsertGis
 *   - Archivos (ArchivosOrganizacion)
 */
@Injectable()
export class OrganizacionService {
  constructor(private readonly repo: OrganizacionRepository) {}

  // ==================== ORGANIZACIONES ====================

  /** Crea organización para un caso. Aplica .toUpperCase() en nombre, nit, matrícula y representante. */
  async crear(
    idCaso: string,
    dto: CreateOrganizacionDto,
    usuario: string
  ): Promise<S2iEmpresa> {
    const empresa = new S2iEmpresa({
      idCaso,
      idTipoOrganizacion: dto.idTipoOrganizacion,
      nombre: dto.nombre.trim().toUpperCase(),
      nit: dto.nit?.trim().toUpperCase() ?? '',
      matricula: dto.matricula?.trim().toUpperCase() ?? '',
      representante: dto.representante?.trim().toUpperCase() ?? '',
      observaciones: dto.observaciones?.trim() ?? '',
      usuario: usuario.trim(),
    })
    return this.repo.crear(empresa)
  }

  async listarPorCaso(idCaso: string): Promise<any[]> {
    const datos = await this.repo.listarPorCaso(idCaso)
    return datos.map(({ tipoOrganizacion, ...e }) => ({
      ...e,
      descripcionTipoOrganizacion: tipoOrganizacion?.descripcion ?? null,
    }))
  }

  async eliminar(idEmpresa: string): Promise<void> {
    const existe = await this.repo.buscarPorId(idEmpresa)
    if (!existe)
      throw new NotFoundException(`Organización ${idEmpresa} no encontrada`)
    await this.repo.eliminar(idEmpresa)
  }

  // ==================== GIS ====================

  async crearLugar(
    idEmpresa: string,
    dto: CreateLugarGisDto
  ): Promise<S2iLugarEmpresa> {
    const existe = await this.repo.buscarPorId(idEmpresa)
    if (!existe)
      throw new NotFoundException(`Organización ${idEmpresa} no encontrada`)

    const lugar = new S2iLugarEmpresa({
      idEmpresa,
      descripcion: dto.descripcion.trim().toUpperCase(),
      coordenadasX: dto.coordenadasX,
      coordenadasY: dto.coordenadasY,
      contenido: dto.contenido.trim(),
    })
    return this.repo.crearLugar(lugar)
  }

  async listarLugares(idEmpresa: string): Promise<S2iLugarEmpresa[]> {
    return this.repo.listarLugaresPorEmpresa(idEmpresa)
  }

  async eliminarLugar(idLugarEmpresa: string): Promise<void> {
    await this.repo.eliminarLugar(idLugarEmpresa)
  }

  // ==================== ARCHIVOS ====================

  async subirArchivo(
    idEmpresa: string,
    dto: CreateArchivoDto,
    nombreArchivo: string,
    data: Buffer
  ): Promise<any> {
    const existe = await this.repo.buscarPorId(idEmpresa)
    if (!existe)
      throw new NotFoundException(`Organización ${idEmpresa} no encontrada`)

    const archivo = new S2iArchivoOrganizacion({
      idEmpresa,
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

  async listarArchivos(idEmpresa: string): Promise<any[]> {
    const archivos = await this.repo.listarArchivosPorEmpresa(idEmpresa)
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
