import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../../shared/constants'
import { BienSecuestrado } from '../entity/bien-secuestrado.entity'
import { BienIncautado } from '../entity/bien-incautado.entity'
import { BienConfiscado } from '../entity/bien-confiscado.entity'
import { PerdidaDominio } from '../entity/perdida-dominio.entity'
import { SituacionBien } from '../entity/situacion-bien.entity'
import { ArchivoBien } from '../entity/archivo-bien.entity'

/**
 * Repositorio BienesRepository
 * Consultas para el seguimiento jurídico de bienes secuestrados (SIII).
 * Cubre: bienes del operativo, secuestro, incautación, confiscación,
 * pérdida de dominio, situación/entrega y archivos documentales.
 * Origen: FRM-JUR-03.aspx.cs
 */
@Injectable()
export class BienesRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  // ==================== BIENES DEL OPERATIVO ====================

  /**
   * Lista los ítems de bien secuestrado en un operativo con descripción completa
   * y sus características anidadas en un arreglo JSON.
   * Origen: Muestrabienes() + gridbien_RowDataBound() — FRM-JUR-03.aspx.cs
   * Tablas: item_bien_secuestrado, catalogo_tipo, catalogo_clase, bienes,
   *         item_bien_caracteristica, catalogo_caracteristica
   */
  async listarBienesPorOperativo(idOperativo: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        ibs.id_item_bien_secuestrado                    AS "id",
        b.descripcion                                   AS "bien",
        cc.descripcion                                  AS "clase",
        ct.descripcion                                  AS "tipo",
        ibs.cantidad_bien                               AS "cantidad",
        COALESCE(
          json_agg(
            json_build_object(
              'id',             ibc.id_item_bien_caracteristica,
              'caracteristica', ccar.descripcion,
              'valor',          ibc.descripcion
            )
          ) FILTER (WHERE ibc.id_item_bien_caracteristica IS NOT NULL),
          '[]'::json
        )                                               AS "caracteristicas"
      FROM public.item_bien_secuestrado ibs
      INNER JOIN public.catalogo_tipo ct
        ON ibs.id_catalogo_tipo = ct.id_catalogo_tipo
      INNER JOIN public.catalogo_clase cc
        ON ct.id_catalogo_clase = cc.id_catalogo_clase
      INNER JOIN parametricas.bienes b
        ON cc.id_bien = b.id_bien
      LEFT JOIN public.item_bien_caracteristica ibc
        ON ibs.id_item_bien_secuestrado = ibc.id_item_bien_secuestrado
      LEFT JOIN public.catalogo_caracteristica ccar
        ON ibc.id_catalogo_caracteristica = ccar.id_catalogo_caracteristica
      WHERE ibs.id_operativo = $1
      GROUP BY
        ibs.id_item_bien_secuestrado,
        b.descripcion,
        cc.descripcion,
        ct.descripcion,
        ibs.cantidad_bien
      ORDER BY ibs.id_item_bien_secuestrado`

    return this.dataSource.query(sql, [idOperativo])
  }

  // ==================== BIEN SECUESTRADO ====================

  /**
   * Lista los registros de secuestro de un ítem de bien.
   * Origen: MuestraSecuestrado() — FRM-JUR-03.aspx.cs
   * Tabla: bien_secuestrado
   */
  async listarBienSecuestradoPorItem(idItemBien: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        bs.id_bien_secuestrado                              AS "id",
        bs.fiscal                                           AS "fiscal",
        TO_CHAR(bs.fecha_acto_secuestro, 'DD/MM/YYYY')     AS "fechaActoSecuestro",
        bs.investigador                                     AS "investigador"
      FROM public.bien_secuestrado bs
      WHERE bs.id_item_bien_secuestrado = $1
      ORDER BY bs.fecha_acto_secuestro DESC`

    return this.dataSource.query(sql, [idItemBien])
  }

  /**
   * Guarda un nuevo registro de secuestro para un ítem de bien.
   * Origen: btnsecuestro_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarBienSecuestrado(data: Partial<BienSecuestrado>): Promise<BienSecuestrado> {
    return this.dataSource.getRepository(BienSecuestrado).save(data)
  }

  // ==================== BIEN INCAUTADO ====================

  /**
   * Lista los registros de incautación de un ítem de bien.
   * Origen: MuestraIncautado() — FRM-JUR-03.aspx.cs
   * Tabla: bien_incautado
   */
  async listarBienIncautadoPorItem(idItemBien: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        bi.id_bien_incautado                          AS "id",
        bi.numero_resolucion                          AS "numeroResolucion",
        TO_CHAR(bi.fecha_res, 'DD/MM/YYYY')           AS "fechaResolucion",
        bi.autoridad                                  AS "autoridad"
      FROM public.bien_incautado bi
      WHERE bi.id_item_bien_secuestrado = $1
      ORDER BY bi.fecha_res DESC`

    return this.dataSource.query(sql, [idItemBien])
  }

  /**
   * Guarda un nuevo registro de incautación para un ítem de bien.
   * Origen: btnincautado_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarBienIncautado(data: Partial<BienIncautado>): Promise<BienIncautado> {
    return this.dataSource.getRepository(BienIncautado).save(data)
  }

  // ==================== BIEN CONFISCADO ====================

  /**
   * Lista los registros de confiscación de un ítem de bien.
   * Origen: MuestraConfiscado() — FRM-JUR-03.aspx.cs
   * Tabla: bien_confiscado
   */
  async listarBienConfiscadoPorItem(idItemBien: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        bc.id_bien_confiscado                                       AS "id",
        bc.numero_sentencia_judicial                                AS "numeroSentenciaJudicial",
        TO_CHAR(bc.fecha_sentencia_judicial, 'DD/MM/YYYY')          AS "fechaSentenciaJudicial",
        bc.autoridad                                                AS "autoridad"
      FROM public.bien_confiscado bc
      WHERE bc.id_item_bien_secuestrado = $1
      ORDER BY bc.fecha_sentencia_judicial DESC`

    return this.dataSource.query(sql, [idItemBien])
  }

  /**
   * Guarda un nuevo registro de confiscación para un ítem de bien.
   * Origen: btnconfiscado_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarBienConfiscado(data: Partial<BienConfiscado>): Promise<BienConfiscado> {
    return this.dataSource.getRepository(BienConfiscado).save(data)
  }

  // ==================== PERDIDA DE DOMINIO ====================

  /**
   * Lista los registros de pérdida de dominio de un ítem de bien.
   * Origen: MuestraDominio() — FRM-JUR-03.aspx.cs
   * Tabla: perdida_dominio
   */
  async listarPerdidaDominioPorItem(idItemBien: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        pd.id_perdida_dominio                           AS "id",
        pd.fiscalia                                     AS "fiscalia",
        TO_CHAR(pd.fecha_resolucion, 'DD/MM/YYYY')      AS "fechaResolucion",
        pd.autoridad                                    AS "autoridad"
      FROM public.perdida_dominio pd
      WHERE pd.id_item_bien_secuestrado = $1
      ORDER BY pd.fecha_resolucion DESC`

    return this.dataSource.query(sql, [idItemBien])
  }

  /**
   * Guarda un nuevo registro de pérdida de dominio para un ítem de bien.
   * Origen: btnperdidadom_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarPerdidaDominio(data: Partial<PerdidaDominio>): Promise<PerdidaDominio> {
    return this.dataSource.getRepository(PerdidaDominio).save(data)
  }

  // ==================== SITUACION DEL BIEN ====================

  /**
   * Lista el historial de situaciones y entregas de un ítem de bien.
   * Incluye la descripción de la calidad del bien (en custodia, entregado, etc.).
   * Origen: Muestraestado() — FRM-JUR-03.aspx.cs
   * Tablas: situacion_bien, calidad_bien
   */
  async listarSituacionBienPorItem(idItemBien: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        sb.id_situacion_bien                                AS "id",
        TO_CHAR(sb.fecha_requerimiento, 'DD/MM/YYYY')       AS "fechaRequerimiento",
        sb.fiscal_requerimiento                             AS "fiscalRequerimiento",
        cb.descripcion                                      AS "calidadBien",
        TO_CHAR(sb.fecha_entrega, 'DD/MM/YYYY')             AS "fechaEntrega",
        sb.responsable_entrega                              AS "responsableEntrega",
        sb.responsable_recepcion                            AS "responsableRecepcion",
        sb.institucion                                      AS "institucion",
        sb.ubicacion                                        AS "ubicacion"
      FROM public.situacion_bien sb
      INNER JOIN parametricas.calidad_bien cb
        ON sb.id_calidad_bien = cb.id_calidad_bien
      WHERE sb.id_item_bien_secuestrado = $1
      ORDER BY sb.fecha_requerimiento DESC`

    return this.dataSource.query(sql, [idItemBien])
  }

  /**
   * Guarda un nuevo registro de situación/entrega para un ítem de bien.
   * Origen: btnentrega_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarSituacionBien(data: Partial<SituacionBien>): Promise<SituacionBien> {
    return this.dataSource.getRepository(SituacionBien).save(data)
  }

  // ==================== ARCHIVOS DOCUMENTALES ====================

  /**
   * Lista los metadatos de los archivos adjuntos a un caso en la sección de bienes.
   * Excluye el blob binario para evitar transferencias innecesarias.
   * Origen: Muestraarchivos() — FRM-JUR-03.aspx.cs
   * Tablas: archivo_bien, contenido_bien
   */
  async listarArchivosBienPorCaso(idCaso: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        ab.id_archivo_bien      AS "id",
        cb.descripcion          AS "contenido",
        ab.tipo                 AS "tipo",
        ab.nombre               AS "nombre",
        ab.nombre_archivo       AS "nombreArchivo"
      FROM public.archivo_bien ab
      INNER JOIN parametricas.contenido_bien cb
        ON ab.id_contenido_bien = cb.id_contenido_bien
      WHERE ab.id_caso = $1
      ORDER BY ab.id_archivo_bien`

    return this.dataSource.query(sql, [idCaso])
  }

  /**
   * Obtiene un archivo completo incluyendo el blob binario para descarga.
   * Origen: DownloadFile() — FRM-JUR-03.aspx.cs
   */
  async buscarArchivoBienPorId(id: string): Promise<ArchivoBien | null> {
    return this.dataSource.getRepository(ArchivoBien).findOne({ where: { id } })
  }

  /**
   * Guarda un nuevo archivo adjunto (blob) vinculado a un caso de bienes.
   * Origen: btnentregaarchivo_Click() — FRM-JUR-03.aspx.cs
   */
  async guardarArchivoBien(data: Partial<ArchivoBien>): Promise<ArchivoBien> {
    return this.dataSource.getRepository(ArchivoBien).save(data)
  }

  /**
   * Elimina un archivo adjunto de la sección de bienes.
   * Origen: gridbdbienes_RowDeleting / deletearchivo() — FRM-JUR-03.aspx.cs
   */
  async eliminarArchivoBien(id: string): Promise<void> {
    await this.dataSource.getRepository(ArchivoBien).delete(id)
  }
}
