import { Injectable } from '@nestjs/common'
import { PersonasRepository } from '../repository/personas.repository'
import { Situacion } from '../entity/situacion.entity'
import { EtapaProceso } from '../entity/etapa-proceso.entity'
import { CreateSituacionDto } from '../dto/personas.dto'
import { CreateEtapaProcesoDto } from '../dto/personas.dto'

/**
 * Servicio PersonasService
 * Lógica de negocio para la situación jurídica de personas implicadas (SIII).
 * Origen: FRM-JUR-02.aspx.cs
 */
@Injectable()
export class PersonasService {
  constructor(private readonly repository: PersonasRepository) { }

  // ==================== PERSONAS DEL OPERATIVO ====================

  /**
   * Lista las personas implicadas en un operativo.
   * Origen: Muestradetenidos() — FRM-JUR-02.aspx.cs
   */
  async listarPersonasPorOperativo(idOperativo: string) {
    return this.repository.listarPersonasPorOperativo(idOperativo)
  }

  // ==================== SITUACION LEGAL ====================

  /**
   * Lista el historial de situaciones legales de una persona.
   * Origen: Muestrasitu() — FRM-JUR-02.aspx.cs
   */
  async listarSituacionesPorPersona(idDetenido: string) {
    return this.repository.listarSituacionesPorPersona(idDetenido)
  }

  /**
   * Registra una nueva situación legal para una persona implicada.
   * Origen: btnsituacion_Click() — FRM-JUR-02.aspx.cs
   */
  async registrarSituacion(
    idDetenido: string,
    dto: CreateSituacionDto,
    usuario: string
  ): Promise<Situacion> {
    const situacion: Partial<Situacion> = {
      idDetenidoAuxiliar: idDetenido,
      idSituacionLegal: dto.idSituacionLegal,
      nroResolucion: dto.nroResolucion.trim().toUpperCase(),
      lugar: dto.lugar.trim().toUpperCase(),
      fecha: new Date(dto.fecha),
      autoridad: dto.autoridad.trim().toUpperCase(),
      fjt: dto.fjt.trim().toUpperCase(),
      updInf: '',
      fechaHoraIngreso: new Date(),
      usuario,
    }
    return this.repository.guardarSituacion(situacion)
  }

  // // ==================== ETAPA DEL PROCESO ====================

  /**
   * Lista el historial de etapas del proceso de una persona.
   * Origen: Muestraetapas() — FRM-JUR-02.aspx.cs
   */
  async listarEtapasProcesoPorPersona(idDetenido: string) {
    return this.repository.listarEtapasProcesoPorPersona(idDetenido)
  }

  /**
   * Registra una nueva etapa del proceso para una persona implicada.
   * Origen: btnguardaetapa_Click() — FRM-JUR-02.aspx.cs
   */
  async registrarEtapaProceso(
    idDetenido: string,
    dto: CreateEtapaProcesoDto,
    usuario: string
  ): Promise<EtapaProceso> {
    const etapaProceso: Partial<EtapaProceso> = {
      idDetenidoAuxiliar: idDetenido,
      idEstado: dto.idEstado,
      nroResolucion: dto.nroResolucion.trim().toUpperCase(),
      lugar: dto.lugar.trim().toUpperCase(),
      fecha: new Date(dto.fecha),
      autoridad: dto.autoridad.trim().toUpperCase(),
      fjt: dto.fjt.trim().toUpperCase(),
    }
    return this.repository.guardarEtapaProceso(etapaProceso)
  }

}
