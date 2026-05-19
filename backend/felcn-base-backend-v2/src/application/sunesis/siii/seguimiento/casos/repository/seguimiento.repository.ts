import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DB_SIII } from '../../../../shared/constants'
import { Fiscal } from '../entity/fiscal.entity'
import { Jurisdiccion } from '../entity/jurisdiccion.entity'
import { ControlJurisdiccional } from '../entity/control-jurisdiccional.entity'
import { ServidorPolicial } from '../../../operativo/entity/servidor-policial.entity'
import { Archivo } from '../entity/archivo.entity'
import { AsignacionSiii } from '../../../asignacion/entity/asignacion-siii.entity'
import { Operativo } from '../../../operativo/entity/operativo.entity'
import { Investigador } from '../../../investigacion/paralelo/entity/investigador.entity'

/**
 * Repositorio SeguimientoRepository
 * Maneja las consultas a las tablas de seguimiento jurídico del SIII.
 * Origen: FRM-JUR-01.aspx.cs
 */
@Injectable()
export class SeguimientoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  // ==================== FISCAL ====================

  /**
   * Lista el historial de fiscales asignados a un caso.
   * Origen: Muestraafiscal() — FRM-JUR-01.aspx.cs
   */
  async listarFiscalesPorCaso(idCaso: string): Promise<Fiscal[]> {
    return this.dataSource.getRepository(Fiscal).find({
      where: { idCaso },
      order: { fecha: 'DESC' },
    })
  }

  /**
   * Establece todos los registros de fiscales de un caso como NO actuales.
   * Origen: actualizafiscal() — FRM-JUR-01.aspx.cs
   */
  async setFiscalNoActual(idCaso: string): Promise<void> {
    await this.dataSource.getRepository(Fiscal).update({ idCaso }, { esActual: false })
  }

  /**
   * Guarda un nuevo registro de fiscal.
   * Origen: insertfiscal() — FRM-JUR-01.aspx.cs
   */
  async guardarFiscal(fiscal: Partial<Fiscal>): Promise<Fiscal> {
    return this.dataSource.getRepository(Fiscal).save(fiscal)
  }

  // ==================== JURISDICCION ====================

  /**
   * Lista el historial de jurisdicciones de un caso.
   * Origen: Muestrajuris() — FRM-JUR-01.aspx.cs
   */
  async listarJurisdiccionesPorCaso(idCaso: string): Promise<Jurisdiccion[]> {
    return this.dataSource.getRepository(Jurisdiccion).find({
      where: { idCaso },
      order: { fecha: 'DESC' },
    })
  }

  /**
   * Establece todas las jurisdicciones de un caso como NO actuales.
   * Origen: actualizajuris() — FRM-JUR-01.aspx.cs
   */
  async setJurisdiccionNoActual(idCaso: string): Promise<void> {
    await this.dataSource.getRepository(Jurisdiccion).update({ idCaso }, { esActual: false })
  }

  /**
   * Guarda un nuevo registro de jurisdicción.
   * Origen: insertjuris() — FRM-JUR-01.aspx.cs
   */
  async guardarJurisdiccion(jurisdiccion: Partial<Jurisdiccion>): Promise<Jurisdiccion> {
    return this.dataSource.getRepository(Jurisdiccion).save(jurisdiccion)
  }

  // ==================== CONTROL JURISDICCIONAL ====================

  /**
   * Lista el historial de control jurisdiccional (juzgados/tribunales).
   * Origen: Muestraconjuris() — FRM-JUR-01.aspx.cs
   */
  async listarControlJurisdiccionalPorCaso(idCaso: string): Promise<ControlJurisdiccional[]> {
    return this.dataSource.getRepository(ControlJurisdiccional).find({
      where: { idCaso },
      order: { fecha: 'DESC' },
    })
  }

  /**
   * Establece todos los controles jurisdiccionales como NO actuales.
   * Origen: actualizaconjuris() — FRM-JUR-01.aspx.cs
   */
  async setControlJurisdiccionalNoActual(idCaso: string): Promise<void> {
    await this.dataSource.getRepository(ControlJurisdiccional).update({ idCaso }, { esActual: false })
  }

  /**
   * Guarda un nuevo registro de control jurisdiccional.
   * Origen: insertconjuris() — FRM-JUR-01.aspx.cs
   */
  async guardarControlJurisdiccional(
    control: Partial<ControlJurisdiccional>
  ): Promise<ControlJurisdiccional> {
    return this.dataSource.getRepository(ControlJurisdiccional).save(control)
  }

  // ==================== INVESTIGADOR (Asignado al Caso) ====================

  /**
   * Lista el historial de investigadores asignados a un caso.
   * Origen: Muestraasignado() — FRM-JUR-01.aspx.cs
   */
  async listarInvestigadoresPorCaso(idCaso: string): Promise<Investigador[]> {
    return this.dataSource.getRepository(Investigador).find({
      where: { idCaso },
      relations: ['grado'],
      order: { fecha: 'DESC' },
    })
  }

  /**
   * Establece todos los investigadores de un caso como NO actuales.
   * Origen: actualizaasignado() — FRM-JUR-01.aspx.cs
   */
  async setInvestigadorNoActual(idCaso: string): Promise<void> {
    await this.dataSource.getRepository(Investigador).update({ idCaso }, { esActual: false })
  }

  /**
   * Guarda un nuevo registro de investigador asignado.
   * Origen: insertasignado() — FRM-JUR-01.aspx.cs
   */
  async guardarInvestigador(investigador: Partial<Investigador>): Promise<Investigador> {
    return this.dataSource.getRepository(Investigador).save(investigador)
  }

  // ==================== SERVIDOR POLICIAL ====================

  /**
   * Lista los servidores policiales que participaron en el operativo.
   * Origen: Muestragrados() — FRM-JUR-01.aspx.cs
   */
  async listarServidoresPolicialesPorOperativo(idOperativo: string): Promise<ServidorPolicial[]> {
    return this.dataSource.getRepository(ServidorPolicial).find({
      where: { idOperativo },
      relations: ['grado'],
      order: { idGrado: 'ASC' },
    })
  }

  /**
   * Agrega un servidor policial al operativo.
   * Origen: btnservpoladd_Click — FRM-JUR-01.aspx.cs
   */
  async guardarServidorPolicial(servidor: Partial<ServidorPolicial>): Promise<ServidorPolicial> {
    return this.dataSource.getRepository(ServidorPolicial).save(servidor)
  }

  // ==================== ARCHIVOS ====================

  /**
   * Lista los metadatos de los archivos adjuntos a un caso.
   * Origen: Muestraarchivos() — FRM-JUR-01.aspx.cs
   */
  async listarArchivosPorCaso(idCaso: string): Promise<Archivo[]> {
    return this.dataSource.getRepository(Archivo).find({
      where: { idCaso },
      relations: ['contenidoCaso'],
      select: {
        id: true,
        idCaso: true,
        idContenidoCaso: true,
        tipo: true,
        nombre: true,
        nombreArchivo: true,
        contenidoCaso: {
          descripcion: true,
        },
      },
    })
  }

  /**
   * Obtiene un archivo completo (incluyendo el blob de datos).
   * Origen: DownloadFile() — FRM-JUR-01.aspx.cs
   */
  async buscarArchivoPorId(id: string): Promise<Archivo | null> {
    return this.dataSource.getRepository(Archivo).findOne({ where: { id } })
  }

  /**
   * Sube un nuevo archivo (blob).
   * Origen: btnarchivo_Click — FRM-JUR-01.aspx.cs
   */
  async guardarArchivo(archivo: Partial<Archivo>): Promise<Archivo> {
    return this.dataSource.getRepository(Archivo).save(archivo)
  }

  /**
   * Elimina un archivo adjunto.
   * Origen: deletearchivo() — FRM-JUR-01.aspx.cs
   */
  async eliminarArchivo(id: string): Promise<void> {
    await this.dataSource.getRepository(Archivo).delete(id)
  }

  // ==================== METADATOS CASO ====================

  /**
   * Actualiza datos básicos en la tabla ASIGNACION (CUD, PerDom, Etapa).
   * Origen: btnactperdom_Click, btnactcud_Click, btnactetapa_Click — FRM-JUR-01.aspx.cs
   */
  async actualizarAsignacion(idCaso: string, data: Partial<AsignacionSiii>): Promise<void> {
    await this.dataSource.getRepository(AsignacionSiii).update(idCaso, data)
  }

  /**
   * Actualiza el informe/relación del hecho en la tabla OPERATIVO.
   * Origen: btnactinforme_Click — FRM-JUR-01.aspx.cs
   */
  async actualizarOperativo(idOperativo: string, data: Partial<Operativo>): Promise<void> {
    await this.dataSource.getRepository(Operativo).update(idOperativo, data)
  }

  /**
   * Obtiene los datos de cabecera de un caso (Asignación) con su etapa.
   * Origen: buscaop() — FRM-JUR-01.aspx.cs
   */
  async obtenerCabeceraSeguimiento(idCaso: string): Promise<Record<string, unknown>> {
    const sql = `
      SELECT 
        a.id_caso               AS "id",
        a.numero_caso           AS "numeroCaso",
        a.numero_operativo      AS "nroOperativo",
        a.nombre_caso           AS "nombreCaso",
        a.asignado_caso         AS "asignadoCaso",
        a.fiscal_asignado_caso  AS "fiscalAsignadoCaso",
        a.numero_caso_per_dom   AS "nroCasoPerDom",
        a.ianus                 AS "ianus",
        a.id_etapa_investigacion AS "idEtapaInvestigacion",
        e.descripcion           AS "etapa"
      FROM public.asignacion a
      LEFT JOIN parametricas.etapa_investigacion e ON a.id_etapa_investigacion = e.id_etapa_investigacion
      WHERE a.id_caso = $1`

    const results = await this.dataSource.query(sql, [idCaso])
    return results[0] || null
  }
}
