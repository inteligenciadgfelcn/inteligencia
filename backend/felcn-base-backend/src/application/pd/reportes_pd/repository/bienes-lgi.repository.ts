import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { BienSecuestradoLgiRepository } from '@/application/lgi/bienes_secuestrados/repository/bien_secuestrado_lgi.repository'

export interface SituacionBienPdReporte {
  idSituacion: string
  itemBienSecId: string
  fiscalia: string
  fechaResolucion: Date
  autoridad: string
  fechaHoraIngreso: Date
  usuario: string
  idMedidaCautelar: number | null
  medidaCautelar: string | null
}

export interface ImplicadoBienReporte {
  idVinculoBien: string
  idDetenidoAuxiliar: number | null
  idVinculo: number | null
  idTipoVinculo: number | null
  itemBienSecId: string
  fechaHoraIngreso: Date | null
  usuario: string | null
  nombreCompleto: string
  numeroDocumento: string | null
}

@Injectable()
export class BienesLgiReporteRepository {
  constructor(
    private readonly bienesRepository: BienSecuestradoLgiRepository,

    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  // =====================================================
  // OBTENER BIEN CON SUS RELACIONES EXISTENTES
  // =====================================================

  async obtenerBien(idBien: number): Promise<any> {
    return this.bienesRepository.findOne(idBien)
  }

  // =====================================================
  // DATOS GENERALES DEL BIEN
  // =====================================================

  async obtenerDatosBien(idBien: number): Promise<any> {
    const filas = await this.dataSource.query(
      `
        SELECT
          b.*,
          ct.descripcion AS "tipoDescripcion",
          cl.descripcion AS "claseDescripcion"

        FROM public.itembiensecuestrado b

        LEFT JOIN parametricas.catalogotipo ct
          ON ct.cattipo_id = b.cattipo_id

        LEFT JOIN parametricas.catalogoclase cl
          ON cl.catclas_id = ct.catclas_id

        WHERE b.itembiensec_id = $1
          AND UPPER(TRIM(b.estado)) = 'ACTIVO'
      `,
      [idBien]
    )

    return filas[0] ?? null
  }

  // =====================================================
  // CARACTERÍSTICAS DEL BIEN
  // =====================================================

  async obtenerCaracteristicas(idBien: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          ic.itembiencar_id AS "idCaracteristica",
          cc.descripcion AS "etiqueta",
          ic.descripcion AS "valor",
          ic.fechahoraing AS "fechaHoraIngreso",
          ic.usuario,
          ic.estado

        FROM public.itembiencaracteristicas ic

        LEFT JOIN parametricas.catalogocaracteristicas cc
          ON cc.catcarac_id = ic.catcarac_id

        WHERE ic.itembiensec_id = $1
          AND UPPER(TRIM(ic.estado)) = 'ACTIVO'

        ORDER BY ic.itembiencar_id ASC
      `,
      [idBien]
    )
  }

  // =====================================================
  // HISTORIAL DE SITUACIÓN DEL BIEN
  // TABLA: public.perdidadominio
  //
  // La primera fila corresponde a la última situación
  // por fecha de resolución.
  // =====================================================

  async obtenerHistorialSituacionBien(
    idBien: number
  ): Promise<SituacionBienPdReporte[]> {
    return this.dataSource.query(
      `
        SELECT
          pd.perdom_id::text AS "idSituacion",
          pd.itembiensec_id::text AS "itemBienSecId",
          pd.fiscalia,
          pd.fechares AS "fechaResolucion",
          pd.autoridad,
          pd.fechahoraing AS "fechaHoraIngreso",
          TRIM(pd.usuario) AS "usuario",
          pd.id_medida_cautelar AS "idMedidaCautelar",
          mc.descripcion AS "medidaCautelar"

        FROM public.perdidadominio pd

        LEFT JOIN parametricas.medida_cautelar mc
          ON mc.id_medida_cautelar = pd.id_medida_cautelar

        WHERE pd.itembiensec_id = $1

        ORDER BY
          pd.fechares DESC NULLS LAST,
          pd.fechahoraing DESC NULLS LAST,
          pd.perdom_id DESC
      `,
      [idBien]
    )
  }

  // =====================================================
  // ÚLTIMA SITUACIÓN DEL BIEN
  // =====================================================

  async obtenerUltimaSituacionBien(
    idBien: number
  ): Promise<SituacionBienPdReporte | null> {
    const filas: SituacionBienPdReporte[] = await this.dataSource.query(
      `
          SELECT
            pd.perdom_id::text AS "idSituacion",
            pd.itembiensec_id::text AS "itemBienSecId",
            pd.fiscalia,
            pd.fechares AS "fechaResolucion",
            pd.autoridad,
            pd.fechahoraing AS "fechaHoraIngreso",
            TRIM(pd.usuario) AS "usuario",
            pd.id_medida_cautelar AS "idMedidaCautelar",
            mc.descripcion AS "medidaCautelar"

          FROM public.perdidadominio pd

          LEFT JOIN parametricas.medida_cautelar mc
            ON mc.id_medida_cautelar = pd.id_medida_cautelar

          WHERE pd.itembiensec_id = $1

          ORDER BY
            pd.fechares DESC NULLS LAST,
            pd.fechahoraing DESC NULLS LAST,
            pd.perdom_id DESC

          LIMIT 1
        `,
      [idBien]
    )

    return filas[0] ?? null
  }

  // =====================================================
  // IMPLICADOS VINCULADOS AL BIEN
  // TABLA: public.vinculo_bien
  // =====================================================

  async obtenerImplicadosBien(idBien: number): Promise<ImplicadoBienReporte[]> {
    return this.dataSource.query(
      `
      SELECT
        vb.id_vinculo_bien::text AS "idVinculoBien",
        vb.id_detenido_auxiliar AS "idDetenidoAuxiliar",
        vb.id_vinculo AS "idVinculo",
        vb.id_tipo_vinculo AS "idTipoVinculo",
        vb.id_item_bien_secuestrado::text AS "itemBienSecId",
        vb.fechahoraing AS "fechaHoraIngreso",
        vb.usuario,

        COALESCE(
          NULLIF(
            CONCAT_WS(
              ' ',
              NULLIF(TRIM(p.de_nombres), ''),
              NULLIF(TRIM(p.de_paterno), ''),
              NULLIF(TRIM(p.de_materno), ''),
              NULLIF(TRIM(p.de_esposo), '')
            ),
            ''
          ),
          'Persona sin nombre registrado'
        ) AS "nombreCompleto",

        NULLIF(TRIM(p.nro_docum), '') AS "numeroDocumento",

        tv.descripcion AS "tipoVinculoDescripcion"

      FROM public.vinculo_bien vb

      LEFT JOIN public.detenidosaux p
        ON p.de_id = vb.id_detenido_auxiliar

      LEFT JOIN parametricas.tipo_vinculo tv
        ON tv.id_vinculo = vb.id_vinculo

      WHERE vb.id_item_bien_secuestrado = $1
        AND UPPER(TRIM(vb.estado)) = 'ACTIVO'

      ORDER BY vb.id_vinculo_bien ASC
    `,
      [idBien]
    )
  }

  // =====================================================
  // DATOS CONSOLIDADOS PARA EL REPORTE
  // =====================================================

  async obtenerReporteCompleto(idBien: number) {
    const datosBien = await this.obtenerDatosBien(idBien)

    if (!datosBien) {
      return null
    }

    const [bien, caracteristicas, historialSituacionBien, implicados] =
      await Promise.all([
        this.obtenerBien(idBien),
        this.obtenerCaracteristicas(idBien),
        this.obtenerHistorialSituacionBien(idBien),
        this.obtenerImplicadosBien(idBien),
      ])

    return {
      datosBien,
      bien,
      caracteristicas,
      historialSituacionBien,
      ultimaSituacionBien: historialSituacionBien[0] ?? null,
      implicados,
    }
  }
}
