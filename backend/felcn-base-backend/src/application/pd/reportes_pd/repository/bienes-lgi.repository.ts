import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { BienSecuestradoLgiRepository } from '@/application/lgi/bienes_secuestrados/repository/bien_secuestrado_lgi.repository'

@Injectable()
export class BienesLgiReporteRepository {
  constructor(
    private readonly bienesRepository: BienSecuestradoLgiRepository,
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,
  ) { }

  async obtenerBien(idBien: number): Promise<any> {
    return this.bienesRepository.findOne(idBien)
  }

  async obtenerDatosBien(idBien: number): Promise<any> {
    const filas = await this.dataSource.query(
      `SELECT b.*, ct.descripcion AS "tipoDescripcion", cl.descripcion AS "claseDescripcion"
       FROM itembiensecuestrado b
       LEFT JOIN parametricas.catalogotipo ct ON ct.cattipo_id = b.cattipo_id
       LEFT JOIN parametricas.catalogoclase cl ON cl.catclas_id = ct.catclas_id
       WHERE b.itembiensec_id = $1 AND b.estado = 'ACTIVO'`,
      [idBien],
    )
    return filas[0] ?? null
  }

  async obtenerCaracteristicas(idBien: number): Promise<any[]> {
    return this.dataSource.query(
      `SELECT ic.itembiencar_id AS "idCaracteristica",
              cc.descripcion AS etiqueta,
              ic.descripcion AS valor,
              ic.fechahoraing AS "fechaHoraIngreso",
              ic.usuario, ic.estado
       FROM itembiencaracteristicas ic
       LEFT JOIN parametricas.catalogocaracteristicas cc ON cc.catcarac_id = ic.catcarac_id
       WHERE ic.itembiensec_id = $1 AND ic.estado = 'ACTIVO'
       ORDER BY ic.itembiencar_id ASC`,
      [idBien],
    )
  }

  async obtenerHistorialSituacionBien(idBien: number): Promise<any[]> {
    const filas: any[] = await this.dataSource.query(
      `SELECT
         sit.sitb_id AS "idSituacion",
         sit.calb_id AS "calbId",
         sit.fechaent AS "fechaEntrega",
         sit.fisreq AS "fiscalRequirente",
         sit.responsabler AS "responsableRecepcion",
         sit.institucion,
         sit.ubicacion,
         sit.id_tipo_documento AS "idTipoDocumento",
         sit.numero_documento AS "numeroDocumento",
         sit.fechahoraing AS "fechaHoraIngreso",
         td.descripcion AS "tipoDocumento"
       FROM situacionbienes sit
       LEFT JOIN parametricas.tipodoc td
  ON td.td_id = sit.id_tipo_documento
       WHERE sit.itembiensec_id = $1
       ORDER BY sit.fechaent DESC NULLS LAST,
                sit.fechahoraing DESC NULLS LAST,
                sit.sitb_id DESC`,
      [idBien],
    )
    const calidades = new Map<string, string | null>()
    for (const fila of filas) {
      const clave = String(fila.calbId)
      if (!calidades.has(clave)) {
        calidades.set(clave, await this.obtenerCalidad(fila.calbId))
      }
    }
    return filas.map((fila) => ({
      ...fila,
      calidad: calidades.get(String(fila.calbId)) ?? 'Sin calidad registrada',
    }))
  }

  async obtenerAnotacionesJuridicas(idBien: number): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
         j.itembienjur_id AS "idAnotacion",
         j.catjur_id AS "catjurId",
         j.descripcion,
         j.fechahoraing AS "fechaHoraIngreso"
       FROM itembienjuridica j
       WHERE j.itembiensec_id = $1 AND j.estado = 'ACTIVO'
       ORDER BY j.fechahoraing DESC NULLS LAST, j.itembienjur_id DESC`,
      [idBien],
    )
  }

  async obtenerCalidad(calbId: number | string): Promise<string | null> {
    // La captura no identifica el esquema del catálogo.
    // Lo resuelve sin asumir public o parametricas.
    const tablas: Array<{ esquema: string }> = await this.dataSource.query(`
      SELECT n.nspname AS esquema
      FROM pg_catalog.pg_class c
      INNER JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relname = 'calidadbien'
        AND c.relkind IN ('r', 'p', 'v', 'm')
        AND n.nspname NOT IN ('pg_catalog', 'information_schema')
    `)
    if (tablas.length !== 1) {
      throw new InternalServerErrorException(
        'No se pudo identificar un único catálogo calidadbien; configura su esquema en el repositorio del reporte',
      )
    }
    const esquema = '"' + tablas[0].esquema.replace(/"/g, '""') + '"'
    const filas: Array<{ descripcion: string | null }> = await this.dataSource.query(
      `SELECT descripcion FROM ${esquema}.calidadbien WHERE calb_id = $1`,
      [calbId],
    )
    return filas[0]?.descripcion ?? null
  }
}
