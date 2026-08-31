import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../../shared/constants'
import { Situacion } from '../entity/situacion.entity'
import { EtapaProceso } from '../entity/etapa-proceso.entity'

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
  ) { }

  // ==================== PERSONAS DEL OPERATIVO ====================

  /**
   * Lista las personas implicadas en un operativo con sus datos de identificación.
   * Origen: Muestradetenidos() — FRM-JUR-02.aspx.cs
   * Tablas: detenido_auxiliar, pais, estado_civil
   *
   * Orden: Principal Implicado, Aprehendido, Arrestado — según la columna
   * `estado` de persona_auxiliar (registro del operativo), cruzada con
   * detenido_auxiliar por id_operativo + nombres + apellidos, el mismo
   * criterio de coincidencia usado en migrar-persona-a-detenido-auxiliar.sql.
   * Quien no tenga coincidencia queda al final, orden alfabético.
   */
  async listarPersonasPorOperativo(idOperativo: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        da.id_detenido_auxiliar                                             AS "id",
        TRIM(da.nombres) || ' ' ||
        TRIM(da.apellido_paterno) || ' ' ||
        TRIM(COALESCE(da.apellido_materno, '')) || ' ' ||
        TRIM(COALESCE(da.apellido_esposo, ''))                             AS "nombreCompleto",
        p.descripcion                                                       AS "nacionalidad",
        CASE WHEN da.genero = true THEN 'Masculino' ELSE 'Femenino' END AS "genero",
        CASE WHEN da.fecha_nacimiento IS NULL
             THEN '*'
             ELSE TO_CHAR(da.fecha_nacimiento, 'DD/MM/YYYY')
        END                                                                 AS "fechaNacimiento",
        ec.descripcion                                                      AS "estadoCivil",
        da.serie                                                            AS "serie",
        da.seccion                                                          AS "seccion",
        da.direccion                                                        AS "direccion",
        CASE WHEN da.tiene_tarjeta THEN 'SI' ELSE 'NO' END                  AS "tarjeta",
        CASE WHEN da.esta_vivo    THEN 'Vivo' ELSE 'Fallecido' END          AS "condicion"
      FROM public.detenido_auxiliar da
      INNER JOIN parametricas.pais p          ON da.id_pais = p.id_pais
      INNER JOIN parametricas.estado_civil ec ON da.id_estado_civil = ec.id_estado_civil
      LEFT JOIN public.persona_auxiliar pa
        ON pa.id_operativo = da.id_operativo
       AND pa.nombres = da.nombres
       AND pa.apellido_paterno = da.apellido_paterno
       AND pa.apellido_materno = da.apellido_materno
      WHERE da.id_operativo = $1
      ORDER BY
        CASE pa.estado
          WHEN 'Principal Implicado' THEN 1
          WHEN 'Aprehendido'         THEN 2
          WHEN 'Arrestado'           THEN 3
          ELSE 4
        END,
        da.apellido_paterno, da.nombres`

    return this.dataSource.query(sql, [idOperativo])
  }

  // // ==================== SITUACION LEGAL ====================

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

}
