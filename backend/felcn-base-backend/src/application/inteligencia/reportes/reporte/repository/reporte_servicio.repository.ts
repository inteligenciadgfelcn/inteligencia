import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import {  DB_SIII } from '@/core/config/database/database.module'

@Injectable()
export class ReporteServicioRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource,
  ) {}

 async obtenerServicio(
  idServicio: string,
): Promise<any | null> {
  const resultado =
    await this.dataSource.query(
      `
      SELECT
          s.codigo_servicio AS "idServicio",
          s.nombre_caso AS "nombre_caso"
        FROM asignacion s
        WHERE s.codigo_servicio = $1
      `,
      [idServicio],
    )

  return resultado[0] ?? null
}

  async obtenerTotales(
    codServicio: string,
  ): Promise<any> {
    const resultado = await this.dataSource.query(
      `
        SELECT
          ISNULL(SUM(
            CASE
              WHEN ed.Td_Id = 2
              THEN d.Dg_Cantidad
              ELSE 0
            END
          ), 0) AS clorhidrato,

          ISNULL(SUM(
            CASE
              WHEN ed.Td_Id = 1
              THEN d.Dg_Cantidad
              ELSE 0
            END
          ), 0) AS pastaBaseCocaina,

          ISNULL(SUM(
            CASE
              WHEN ed.Td_Id = 4
              THEN d.Dg_Cantidad
              ELSE 0
            END
          ), 0) AS marihuana,

          ISNULL(SUM(
            CASE
              WHEN d.EstDg_Id = 5
              THEN d.Dg_Cantidad
              ELSE 0
            END
          ), 0) AS drogaLiquida

        FROM ASIGNACION a
        INNER JOIN OPERATIVO op
          ON op.Casos_Id = a.Casos_Id
        LEFT JOIN DROGAS d
          ON d.Op_Id = op.Op_Id
        LEFT JOIN ESTADODROGA ed
          ON ed.EstDg_Id = d.EstDg_Id

        WHERE RTRIM(a.CodServicio) = @0
      `,
      [codServicio.trim()],
    )

    return resultado[0] ?? {
      clorhidrato: 0,
      pastaBaseCocaina: 0,
      marihuana: 0,
      drogaLiquida: 0,
    }
  }

  async obtenerTotalesSustancias(
    codServicio: string,
  ): Promise<any> {
    const resultado = await this.dataSource.query(
      `
        SELECT
          ISNULL((
            SELECT SUM(ss.Ss_Cantidad)
            FROM ASIGNACION a1
            INNER JOIN OPERATIVO op1
              ON op1.Casos_Id = a1.Casos_Id
            INNER JOIN SUSTANCIASSOL ss
              ON ss.Op_Id = op1.Op_Id
            WHERE RTRIM(a1.CodServicio) = @0
              AND ss.Ssd_Id <> 52
          ), 0) AS solidas,

          ISNULL((
            SELECT SUM(ss.Ss_Cantidad)
            FROM ASIGNACION a2
            INNER JOIN OPERATIVO op2
              ON op2.Casos_Id = a2.Casos_Id
            INNER JOIN SUSTANCIASSOL ss
              ON ss.Op_Id = op2.Op_Id
            WHERE RTRIM(a2.CodServicio) = @0
              AND ss.Ssd_Id = 52
          ), 0) AS solidasSinDeterminar,

          ISNULL((
            SELECT SUM(sl.Sl_Cantidad)
            FROM ASIGNACION a3
            INNER JOIN OPERATIVO op3
              ON op3.Casos_Id = a3.Casos_Id
            INNER JOIN SUSTANCIALIQ sl
              ON sl.Op_Id = op3.Op_Id
            WHERE RTRIM(a3.CodServicio) = @0
              AND sl.Sld_Id <> 69
          ), 0) AS liquidas,

          ISNULL((
            SELECT SUM(sl.Sl_Cantidad)
            FROM ASIGNACION a4
            INNER JOIN OPERATIVO op4
              ON op4.Casos_Id = a4.Casos_Id
            INNER JOIN SUSTANCIALIQ sl
              ON sl.Op_Id = op4.Op_Id
            WHERE RTRIM(a4.CodServicio) = @0
              AND sl.Sld_Id = 69
          ), 0) AS liquidasSinDeterminar
      `,
      [codServicio.trim()],
    )

    return resultado[0] ?? {
      solidas: 0,
      solidasSinDeterminar: 0,
      liquidas: 0,
      liquidasSinDeterminar: 0,
    }
  }

  async obtenerOtrasDrogas(
    codServicio: string,
  ): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          td.Td_Id AS idTipoDroga,
          RTRIM(td.Descripcion) AS descripcion,
          ISNULL(SUM(d.Dg_Cantidad), 0) AS cantidad
        FROM DROGAS d
        INNER JOIN ESTADODROGA ed
          ON ed.EstDg_Id = d.EstDg_Id
        INNER JOIN TIPOSDROGA td
          ON td.Td_Id = ed.Td_Id
        INNER JOIN OPERATIVO op
          ON op.Op_Id = d.Op_Id
        INNER JOIN ASIGNACION a
          ON a.Casos_Id = op.Casos_Id
        WHERE RTRIM(a.CodServicio) = @0
          AND ed.Td_Id NOT IN (1, 2, 3, 4)
        GROUP BY
          td.Td_Id,
          td.Descripcion
        ORDER BY td.Descripcion ASC
      `,
      [codServicio.trim()],
    )
  }

  async obtenerFabricas(
    codServicio: string,
  ): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          tf.Tf_Id AS idTipoFabrica,
          CONCAT(RTRIM(tf.Descripcion), '(s)') AS descripcion,
          ISNULL(SUM(f.Cantidad), 0) AS cantidad
        FROM TIPOFABRICA tf
        INNER JOIN FABRICAMODELOS fm
          ON fm.Tf_Id = tf.Tf_Id
        INNER JOIN FABRICAS f
          ON f.FabMod_id = fm.FabMod_id
        INNER JOIN OPERATIVO op
          ON op.Op_Id = f.Op_Id
        INNER JOIN ASIGNACION a
          ON a.Casos_Id = op.Casos_Id
        WHERE RTRIM(a.CodServicio) = @0
        GROUP BY
          tf.Tf_Id,
          tf.Descripcion
        ORDER BY tf.Descripcion ASC
      `,
      [codServicio.trim()],
    )
  }

  async obtenerPersonas(
    codServicio: string,
  ): Promise<any> {
    const resultado = await this.dataSource.query(
      `
        SELECT
          ISNULL(SUM(
            CASE
              WHEN pa.Estado IN (
                'Principal Aprehendido',
                'Aprehendido'
              )
              THEN 1
              ELSE 0
            END
          ), 0) AS aprehendidos,

          ISNULL(SUM(
            CASE
              WHEN pa.Estado = 'Arrestado'
              THEN 1
              ELSE 0
            END
          ), 0) AS arrestados

        FROM ASIGNACION a
        INNER JOIN OPERATIVO op
          ON op.Casos_Id = a.Casos_Id
        LEFT JOIN PERSONASAUX pa
          ON pa.Op_Id = op.Op_Id

        WHERE RTRIM(a.CodServicio) = @0
      `,
      [codServicio.trim()],
    )

    return resultado[0] ?? {
      aprehendidos: 0,
      arrestados: 0,
    }
  }

  async obtenerUbicaciones(
    codServicio: string,
  ): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          op.Op_Id AS idOperativo,
          a.NroCaso AS numeroCaso,
          a.NroOperativo AS numeroOperativo,
          RTRIM(op.Op_Coordx) AS latitud,
          RTRIM(op.Op_Coordy) AS longitud,

          CONCAT(
            'https://www.google.com/maps?q=',
            RTRIM(op.Op_Coordx),
            ',',
            RTRIM(op.Op_Coordy),
            '&hl=es'
          ) AS enlaceMapa

        FROM OPERATIVO op
        INNER JOIN ASIGNACION a
          ON a.Casos_Id = op.Casos_Id

        WHERE RTRIM(a.CodServicio) = @0

        ORDER BY op.Op_FechaOperativo ASC
      `,
      [codServicio.trim()],
    )
  }
}