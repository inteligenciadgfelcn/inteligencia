import { Injectable, NotFoundException } from '@nestjs/common'
import { SeguimientoRepository } from '../repository/seguimiento.repository'
import { InvestigacionRepository } from '../../../investigacion/paralelo/repository/investigacion.repository'
import { Fiscal } from '../entity/fiscal.entity'
import { Jurisdiccion } from '../entity/jurisdiccion.entity'
import { ControlJurisdiccional } from '../entity/control-jurisdiccional.entity'
import { ServidorPolicial } from '../../../operativo/entity/servidor-policial.entity'
import { Archivo } from '../entity/archivo.entity'
import { Investigador } from '../../../investigacion/paralelo/entity/investigador.entity'

/**
 * Servicio SeguimientoService
 * Implementa la lógica de negocio para el seguimiento jurídico de casos SIII.
 * Gestiona el historial de fiscales, jurisdicciones, archivos y metadatos del caso.
 */
@Injectable()
export class SeguimientoService {
  constructor(
    private readonly repository: SeguimientoRepository,
    private readonly investigacionRepository: InvestigacionRepository
  ) { }

  // ==================== CASO / DETALLE ====================

  /**
   * Obtiene la información completa de seguimiento para un caso específico.
   */
  async obtenerDetalleSeguimiento(idCaso: string) {
    const asignacion = await this.repository.obtenerCabeceraSeguimiento(idCaso)
    if (!asignacion) throw new NotFoundException('Caso no encontrado')

    const operativos = await this.investigacionRepository.listarOperativosPorCaso(idCaso)
    const investigadores = await this.repository.listarInvestigadoresPorCaso(idCaso)
    const fiscales = await this.repository.listarFiscalesPorCaso(idCaso)
    const jurisdicciones = await this.repository.listarJurisdiccionesPorCaso(idCaso)
    const controles = await this.repository.listarControlJurisdiccionalPorCaso(idCaso)
    const archivos = await this.repository.listarArchivosPorCaso(idCaso)

    return {
      cabecera: asignacion,
      operativos: operativos.map((op) => this.mapearOperativo(op)),
      investigadores,
      fiscales,
      jurisdicciones,
      controles,
      archivos,
    }
  }

  /**
   * Mapea un operativo al formato esperado por el frontend.
   * Basado en InvestigacionService.mapearOperativo
   */
  private mapearOperativo(op: any) {
    return {
      id: op.id,
      nroInforme: op.numeroInforme,
      fechaOperativo: op.fechaOperativo,
      lugarCompleto: [
        op.departamento?.descripcion?.trim(),
        op.provincia?.descripcion?.trim(),
        op.localidad?.descripcion?.trim(),
        op.lugar?.trim(),
      ]
        .filter(Boolean)
        .join(' '),
      unidadDistrital: [
        op.unidad?.descripcion?.trim(),
        op.distrital?.descripcion?.trim(),
      ]
        .filter(Boolean)
        .join(' '),
      relacionHecho: op.descripcion,
    }
  }

  /**
   * Actualiza los metadatos globales del caso (CUD, Etapa, Informe).
   */
  async actualizarMetadatosCaso(
    idCaso: string,
    idOperativo: string,
    data: {
      ianus?: string
      numeroCasoPerDom?: string
      idEtapaInvestigacion?: number
      descripcionOperativo?: string
    }
  ) {
    if (data.ianus || data.numeroCasoPerDom || data.idEtapaInvestigacion) {
      await this.repository.actualizarAsignacion(idCaso, {
        ianus: data.ianus,
        numeroCasoPerDom: data.numeroCasoPerDom,
        idEtapaInvestigacion: data.idEtapaInvestigacion,
      })
    }

    if (data.descripcionOperativo) {
      await this.repository.actualizarOperativo(idOperativo, {
        descripcion: data.descripcionOperativo,
      })
    }
  }

  // ==================== FISCAL ====================

  /**
   * Registra un nuevo fiscal para el caso, marcando los anteriores como históricos.
   */
  async agregarFiscal(idCaso: string, fiscal: Partial<Fiscal>, usuario: string) {
    await this.repository.setFiscalNoActual(idCaso)
    fiscal.idCaso = idCaso
    fiscal.esActual = true
    fiscal.usuario = usuario
    fiscal.fechaHoraIngreso = new Date()
    fiscal.infoActualizada = ''
    return this.repository.guardarFiscal(fiscal)
  }

  // ==================== JURISDICCION ====================

  /**
   * Registra una nueva jurisdicción para el caso, marcando las anteriores como históricas.
   */
  async agregarJurisdiccion(idCaso: string, jurisdiccion: Partial<Jurisdiccion>, usuario: string) {
    await this.repository.setJurisdiccionNoActual(idCaso)
    jurisdiccion.idCaso = idCaso
    jurisdiccion.esActual = true
    jurisdiccion.usuario = usuario
    jurisdiccion.fechaHoraIngreso = new Date()
    jurisdiccion.infoActualizada = ''
    return this.repository.guardarJurisdiccion(jurisdiccion)
  }

  // ==================== CONTROL JURISDICCIONAL ====================

  /**
   * Registra un nuevo control jurisdiccional (juzgados).
   */
  async agregarControlJurisdiccional(
    idCaso: string,
    control: Partial<ControlJurisdiccional>,
    usuario: string
  ) {
    await this.repository.setControlJurisdiccionalNoActual(idCaso)
    control.idCaso = idCaso
    control.esActual = true
    control.usuario = usuario
    control.fechaHoraIngreso = new Date()
    control.infoActualizada = ''
    return this.repository.guardarControlJurisdiccional(control)
  }

  // ==================== SERVIDOR POLICIAL ====================

  /**
   * Lista los servidores policiales de un operativo.
   */
  async listarServidoresPoliciales(idOperativo: string) {
    return this.repository.listarServidoresPolicialesPorOperativo(idOperativo)
  }

  /**
   * Agrega un servidor policial al operativo.
   */
  async agregarServidorPolicial(
    idOperativo: string,
    servidor: Partial<ServidorPolicial>,
    usuario: string
  ) {
    servidor.idOperativo = idOperativo
    servidor.usuario = usuario
    servidor.fechaHoraIngreso = new Date()
    servidor.infoActualizada = ''
    return this.repository.guardarServidorPolicial(servidor)
  }

  // ==================== ARCHIVOS ====================

  /**
   * Sube un nuevo archivo al caso.
   */
  async subirArchivo(idCaso: string, archivo: Partial<Archivo>) {
    archivo.idCaso = idCaso
    return this.repository.guardarArchivo(archivo)
  }

  /**
   * Obtiene un archivo completo para su descarga.
   */
  async descargarArchivo(idArchivo: string) {
    const archivo = await this.repository.buscarArchivoPorId(idArchivo)
    if (!archivo) throw new NotFoundException('Archivo no encontrado')
    return archivo
  }

  /**
   * Elimina un archivo adjunto del caso.
   */
  async eliminarArchivo(idArchivo: string) {
    return this.repository.eliminarArchivo(idArchivo)
  }

  // ==================== INVESTIGADOR ====================

  /**
   * Registra un nuevo investigador para el caso, marcando los anteriores como históricos.
   */
  async agregarInvestigador(idCaso: string, investigador: Partial<Investigador>, usuario: string) {
    await this.repository.setInvestigadorNoActual(idCaso)
    investigador.idCaso = idCaso
    investigador.esActual = true
    investigador.usuario = usuario
    investigador.fechaHoraIngreso = new Date()
    investigador.infoActualizada = ''
    investigador.usuarioSistema = usuario
    return this.repository.guardarInvestigador(investigador)
  }
}
