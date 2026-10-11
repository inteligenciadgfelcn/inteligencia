import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'

@Injectable()
export class PersonasJuridicasReporteRepository {
  constructor(@InjectDataSource(DB_LGI) private readonly dataSource: DataSource) {}

  async obtenerEmpresa(idEmpresa: number) {
    const filas = await this.dataSource.query(`
      SELECT e.emp_id AS "empId", e.op_id AS "opId", e.nombre, e.nit,
        e.matricula, e.representante, e.obs AS "observaciones",
        e.capital_social AS "capitalSocial", e.direccion,
        e.latitud, e.longitud, e.pericia, e.resultado, e.imagen,
        e.documento IS NOT NULL AND TRIM(e.documento) <> '' AS "tieneDocumento",
        e.fechahoraing AS "fechaHoraIngreso", TRIM(e.usuario) AS "usuario",
        v.descripcion AS "vinculoDescripcion"
      FROM empresas e
      LEFT JOIN parametricas.vinculo v ON v.id_vinculo = e.id_vinculo
      WHERE e.emp_id = $1`, [idEmpresa])
    return filas[0] ?? null
  }

  obtenerHistorialJuridico(idEmpresa: number): Promise<any[]> {
    return this.dataSource.query(`
      SELECT s.fecha, s.fechahoraing AS "fechaHoraIngreso",
        TRIM(s.usuario) AS "usuario", t.descripcion AS "descripcionTipo"
      FROM situacion_juridica_empresa s
      LEFT JOIN parametricas.tipo_situacion_juridica t
        ON t.id_tipo_situacion_juridica = s.id_tipo_situacion_juridica
      WHERE s.id_empresa = $1
      ORDER BY s.fecha DESC NULLS LAST, s.fechahoraing DESC NULLS LAST,
        s.id_situacion_juridica_empresa DESC`, [idEmpresa])
  }

  obtenerImplicados(idEmpresa: number): Promise<any[]> {
    return this.dataSource.query(`
      SELECT CONCAT_WS(' ', NULLIF(TRIM(i.de_nombres), ''),
          NULLIF(TRIM(i.de_paterno), ''), NULLIF(TRIM(i.de_materno), ''),
          NULLIF(TRIM(i.de_esposo), '')) AS "nombre",
        ti.descripcion AS "tipoImplicado", td.descripcion AS "tipoDocumento",
        i.nrodoc AS "numeroDocumento", i.fechahoraing AS "fechaHoraIngreso"
      FROM implicados i
      LEFT JOIN parametricas.tipoimplicado ti ON ti.id_tipo_implicado = i.id_tipo_implicado
      LEFT JOIN parametricas.tipodoc td ON td.td_id = i.tipo_documento
      WHERE i.id_empresa = $1 AND UPPER(TRIM(i.estado)) = 'ACTIVO'
      ORDER BY i.fechahoraing DESC NULLS LAST, i.imp_id DESC`, [idEmpresa])
  }
}
