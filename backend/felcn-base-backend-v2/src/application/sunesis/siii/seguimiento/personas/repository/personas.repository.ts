import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../../shared/constants'
import { Situacion } from '../entity/situacion.entity'
import { Estado } from '../entity/estado.entity'
import { EtapaProceso } from '../entity/etapa-proceso.entity'
import { SituacionLegal } from '../../../parametrica/entity/sustancia/situacion-legal.entity'
import { Etapa } from '../../../parametrica/entity/operativo/etapa.entity'

/**
 * Repositorio PersonasRepository
 * Consultas para la situación jurídica de personas implicadas (SIII).
 * Origen: FRM-JUR-02.aspx.cs
 */
@Injectable()
export class PersonasRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  // ==================== PERSONAS DEL OPERATIVO ====================

  /**
   * Lista las personas implicadas en un operativo con sus datos de identificación.
   * Origen: Muestradetenidos() — FRM-JUR-02.aspx.cs
   * Tablas: persona_auxiliar, pais, estado_civil
   */
  async listarPersonasPorOperativo(idOperativo: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        pa.id_persona_auxiliar                                              AS "id",
        TRIM(pa.nombres) || ' ' ||
        TRIM(pa.apellido_paterno) || ' ' ||
        TRIM(COALESCE(pa.apellido_materno, '')) || ' ' ||
        TRIM(COALESCE(pa.apellido_esposo, ''))                             AS "nombreCompleto",
        p.descripcion                                                       AS "nacionalidad",
        CASE WHEN pa.genero = '1' THEN 'Masculino' ELSE 'Femenino' END    AS "genero",
        CASE WHEN pa.fecha_nacimiento IS NULL
             THEN '*'
             ELSE TO_CHAR(pa.fecha_nacimiento, 'DD/MM/YYYY')
        END                                                                 AS "fechaNacimiento",
        COALESCE(ec.descripcion, '')                                        AS "estadoCivil",
        pa.nro_documento                                                    AS "nroDocumento",
        pa.direccion                                                        AS "direccion",
        pa.estado                                                           AS "condicion"
      FROM public.persona_auxiliar pa
      INNER JOIN parametricas.pais p ON pa.id_pais = p.id_pais
      LEFT  JOIN parametricas.estado_civil ec ON pa.id_estado_civil = ec.id_estado_civil
      WHERE pa.id_operativo = $1
      ORDER BY pa.apellido_paterno, pa.nombres`

    return this.dataSource.query(sql, [idOperativo])
  }

  // ==================== SITUACION LEGAL ====================

  /**
   * Lista el historial de situaciones legales de una persona implicada.
   * Origen: Muestrasitu() — FRM-JUR-02.aspx.cs
   * Tablas: situacion, situacion_legal
   */
  async listarSituacionesPorPersona(idDetenido: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        s.id_situacion                                                      AS "id",
        sl.descripcion                                                      AS "situacionLegal",
        s.nro_resolucion                                                    AS "nroResolucion",
        s.lugar                                                             AS "lugar",
        CASE WHEN s.fecha IS NULL
             THEN ''
             ELSE TO_CHAR(s.fecha, 'DD/MM/YYYY')
        END                                                                 AS "fecha",
        s.autoridad                                                         AS "autoridad",
        s.fjt                                                               AS "fjt"
      FROM public.situacion s
      INNER JOIN parametricas.situacion_legal sl ON s.id_situacion_legal = sl.id_situacion_legal
      WHERE s.id_detenido_auxiliar = $1
      ORDER BY s.fecha DESC`

    return this.dataSource.query(sql, [idDetenido])
  }

  /**
   * Guarda una nueva situación legal para la persona implicada.
   * Origen: btnsituacion_Click() — FRM-JUR-02.aspx.cs
   */
  async guardarSituacion(situacion: Partial<Situacion>): Promise<Situacion> {
    return this.dataSource.getRepository(Situacion).save(situacion)
  }

  // ==================== ETAPA DEL PROCESO ====================

  /**
   * Lista el historial de etapas del proceso de una persona implicada.
   * Origen: Muestraetapas() — FRM-JUR-02.aspx.cs
   * Tablas: etapa_proceso, estado, etapa
   */
  async listarEtapasProcesoPorPersona(idDetenido: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        ep.id_etapa_proceso   AS "id",
        e.descripcion         AS "etapa",
        es.descripcion        AS "estado",
        ep.nro_resolucion     AS "nroResolucion",
        ep.lugar              AS "lugar",
        ep.fecha              AS "fecha",
        ep.autoridad          AS "autoridad",
        ep.fjt                AS "fjt"
      FROM public.etapa_proceso ep
      INNER JOIN public.estado es          ON ep.id_estado = es.id_estado
      INNER JOIN parametricas.etapa e      ON es.id_etapa  = e.id_etapa
      WHERE ep.id_detenido_auxiliar = $1
      ORDER BY ep.fecha DESC`

    return this.dataSource.query(sql, [idDetenido])
  }

  /**
   * Guarda una nueva etapa del proceso para la persona implicada.
   * Origen: btnguardaetapa_Click() — FRM-JUR-02.aspx.cs
   */
  async guardarEtapaProceso(etapaProceso: Partial<EtapaProceso>): Promise<EtapaProceso> {
    return this.dataSource.getRepository(EtapaProceso).save(etapaProceso)
  }

  // ==================== LOOKUPS ====================

  /**
   * Lista todas las situaciones legales para poblar el dropdown.
   * Origen: Situlegal() — FRM-JUR-02.aspx.cs
   * Tabla: parametricas.situacion_legal
   */
  async listarSituacionesLegales(): Promise<SituacionLegal[]> {
    return this.dataSource
      .getRepository(SituacionLegal)
      .find({ order: { descripcion: 'ASC' } })
  }

  /**
   * Lista todas las etapas del proceso para poblar el dropdown.
   * Origen: Etapalegal() — FRM-JUR-02.aspx.cs
   * Tabla: parametricas.etapa
   */
  async listarEtapas(): Promise<Etapa[]> {
    return this.dataSource
      .getRepository(Etapa)
      .find({ order: { descripcion: 'ASC' } })
  }

  /**
   * Lista los estados del proceso filtrados por etapa (cascade dropdown).
   * Origen: ddletapa_SelectedIndexChanged() — FRM-JUR-02.aspx.cs
   * Tablas: estado
   */
  async listarEstadosPorEtapa(idEtapa: number): Promise<Estado[]> {
    return this.dataSource
      .getRepository(Estado)
      .find({ where: { idEtapa }, order: { descripcion: 'ASC' } })
  }
}
