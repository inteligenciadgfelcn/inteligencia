import { Injectable, NotFoundException } from '@nestjs/common'
import { BienesRepository } from '../repository/bienes.repository'
import { BienSecuestrado } from '../entity/bien-secuestrado.entity'
import { BienIncautado } from '../entity/bien-incautado.entity'
import { BienConfiscado } from '../entity/bien-confiscado.entity'
import { PerdidaDominio } from '../entity/perdida-dominio.entity'
import { SituacionBien } from '../entity/situacion-bien.entity'
import { ArchivoBien } from '../entity/archivo-bien.entity'
import {
  CreateBienSecuestradoDto,
  CreateBienIncautadoDto,
  CreateBienConfiscadoDto,
  CreatePerdidaDominioDto,
  CreateSituacionBienDto,
} from '../dto/bienes.dto'

/**
 * Servicio BienesService
 * Lógica de negocio para el seguimiento jurídico de bienes secuestrados (SIII).
 * Cubre: bienes del operativo, secuestro, incautación, confiscación,
 * pérdida de dominio, situación/entrega y archivos documentales.
 * Origen: FRM-JUR-03.aspx.cs
 */
@Injectable()
export class BienesService {
  constructor(private readonly repository: BienesRepository) {}

  // ==================== BIENES DEL OPERATIVO ====================

  /**
   * Lista los ítems de bien de un operativo con sus características.
   * Origen: Muestrabienes() + gridbien_RowDataBound() — FRM-JUR-03.aspx.cs
   */
  async listarBienesPorOperativo(idOperativo: string) {
    return this.repository.listarBienesPorOperativo(idOperativo)
  }

  // ==================== BIEN SECUESTRADO ====================

  /**
   * Lista el historial de secuestros de un ítem de bien.
   * Origen: MuestraSecuestrado() — FRM-JUR-03.aspx.cs
   */
  async listarBienSecuestrado(idItemBien: string) {
    return this.repository.listarBienSecuestradoPorItem(idItemBien)
  }

  /**
   * Registra el acto de secuestro de un ítem de bien.
   * Origen: btnsecuestro_Click() — FRM-JUR-03.aspx.cs
   */
  async registrarBienSecuestrado(
    idItemBien: string,
    dto: CreateBienSecuestradoDto,
    usuario: string
  ): Promise<BienSecuestrado> {
    const data: Partial<BienSecuestrado> = {
      idItemBienSecuestrado: idItemBien,
      fiscal: dto.fiscal.trim().toUpperCase(),
      fechaActoSecuestro: new Date(dto.fechaActoSecuestro),
      investigador: dto.investigador.trim().toUpperCase(),
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarBienSecuestrado(data)
  }

  // ==================== BIEN INCAUTADO ====================

  /**
   * Lista el historial de incautaciones de un ítem de bien.
   * Origen: MuestraIncautado() — FRM-JUR-03.aspx.cs
   */
  async listarBienIncautado(idItemBien: string) {
    return this.repository.listarBienIncautadoPorItem(idItemBien)
  }

  /**
   * Registra la incautación formal de un ítem de bien.
   * Origen: btnincautado_Click() — FRM-JUR-03.aspx.cs
   */
  async registrarBienIncautado(
    idItemBien: string,
    dto: CreateBienIncautadoDto,
    usuario: string
  ): Promise<BienIncautado> {
    const data: Partial<BienIncautado> = {
      idItemBienSecuestrado: idItemBien,
      numeroResolucion: dto.numeroResolucion.trim().toUpperCase(),
      fechaResolucion: new Date(dto.fechaResolucion),
      autoridad: dto.autoridad.trim().toUpperCase(),
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarBienIncautado(data)
  }

  // ==================== BIEN CONFISCADO ====================

  /**
   * Lista el historial de confiscaciones de un ítem de bien.
   * Origen: MuestraConfiscado() — FRM-JUR-03.aspx.cs
   */
  async listarBienConfiscado(idItemBien: string) {
    return this.repository.listarBienConfiscadoPorItem(idItemBien)
  }

  /**
   * Registra la confiscación de un ítem de bien mediante sentencia judicial.
   * Origen: btnconfiscado_Click() — FRM-JUR-03.aspx.cs
   */
  async registrarBienConfiscado(
    idItemBien: string,
    dto: CreateBienConfiscadoDto,
    usuario: string
  ): Promise<BienConfiscado> {
    const data: Partial<BienConfiscado> = {
      idItemBienSecuestrado: idItemBien,
      numeroSentenciaJudicial: dto.numeroSentenciaJudicial.trim().toUpperCase(),
      fechaSentenciaJudicial: new Date(dto.fechaSentenciaJudicial),
      autoridad: dto.autoridad.trim().toUpperCase(),
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarBienConfiscado(data)
  }

  // ==================== PERDIDA DE DOMINIO ====================

  /**
   * Lista el historial de pérdida de dominio de un ítem de bien.
   * Origen: MuestraDominio() — FRM-JUR-03.aspx.cs
   */
  async listarPerdidaDominio(idItemBien: string) {
    return this.repository.listarPerdidaDominioPorItem(idItemBien)
  }

  /**
   * Registra el proceso de pérdida de dominio de un ítem de bien.
   * Origen: btnperdidadom_Click() — FRM-JUR-03.aspx.cs
   */
  async registrarPerdidaDominio(
    idItemBien: string,
    dto: CreatePerdidaDominioDto,
    usuario: string
  ): Promise<PerdidaDominio> {
    const data: Partial<PerdidaDominio> = {
      idItemBienSecuestrado: idItemBien,
      fiscalia: dto.fiscalia.trim().toUpperCase(),
      fechaResolucion: new Date(dto.fechaResolucion),
      autoridad: dto.autoridad.trim().toUpperCase(),
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarPerdidaDominio(data)
  }

  // ==================== SITUACION DEL BIEN ====================

  /**
   * Lista el historial de situaciones y entregas de un ítem de bien.
   * Origen: Muestraestado() — FRM-JUR-03.aspx.cs
   */
  async listarSituacionBien(idItemBien: string) {
    return this.repository.listarSituacionBienPorItem(idItemBien)
  }

  /**
   * Registra la situación actual y entrega de un ítem de bien secuestrado.
   * Origen: btnentrega_Click() — FRM-JUR-03.aspx.cs
   */
  async registrarSituacionBien(
    idItemBien: string,
    dto: CreateSituacionBienDto,
    usuario: string
  ): Promise<SituacionBien> {
    const data: Partial<SituacionBien> = {
      idItemBienSecuestrado: idItemBien,
      fechaRequerimiento: new Date(dto.fechaRequerimiento),
      fiscalRequerimiento: dto.fiscalRequerimiento.trim().toUpperCase(),
      idCalidadBien: dto.idCalidadBien,
      fechaEntrega: new Date(dto.fechaEntrega),
      responsableEntrega: dto.responsableEntrega.trim().toUpperCase(),
      responsableRecepcion: dto.responsableRecepcion.trim().toUpperCase(),
      institucion: dto.institucion.trim().toUpperCase(),
      ubicacion: dto.ubicacion.trim().toUpperCase(),
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarSituacionBien(data)
  }

  // ==================== ARCHIVOS DOCUMENTALES ====================

  /**
   * Lista los metadatos de archivos adjuntos de un caso en la sección de bienes.
   * Origen: Muestraarchivos() — FRM-JUR-03.aspx.cs
   */
  async listarArchivosBien(idCaso: string) {
    return this.repository.listarArchivosBienPorCaso(idCaso)
  }

  /**
   * Sube un archivo adjunto vinculado a un caso de bienes.
   * Origen: btnentregaarchivo_Click() — FRM-JUR-03.aspx.cs
   */
  async subirArchivoBien(
    idCaso: string,
    idContenidoBien: string,
    tipo: string,
    nombre: string,
    nombreArchivo: string,
    fileBuffer: Buffer
  ): Promise<ArchivoBien> {
    const data: Partial<ArchivoBien> = {
      idCaso,
      idContenidoBien,
      tipo: tipo.trim(),
      nombre: nombre.trim().toUpperCase(),
      nombreArchivo: nombreArchivo.trim(),
      data: fileBuffer,
    }
    return this.repository.guardarArchivoBien(data)
  }

  /**
   * Obtiene el archivo completo (con blob) para descarga.
   * Origen: DownloadFile() — FRM-JUR-03.aspx.cs
   */
  async descargarArchivoBien(id: string): Promise<ArchivoBien> {
    const archivo = await this.repository.buscarArchivoBienPorId(id)
    if (!archivo) {
      throw new NotFoundException('El archivo del bien no fue encontrado')
    }
    return archivo
  }

  /**
   * Elimina un archivo adjunto de la sección de bienes.
   * Origen: gridbdbienes_RowDeleting / deletearchivo() — FRM-JUR-03.aspx.cs
   */
  async eliminarArchivoBien(id: string): Promise<void> {
    return this.repository.eliminarArchivoBien(id)
  }
}
