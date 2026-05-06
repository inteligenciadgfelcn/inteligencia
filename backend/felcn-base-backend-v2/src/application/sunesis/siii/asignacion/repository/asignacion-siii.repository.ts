import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { AsignacionSiii } from '../entity/asignacion-siii.entity'
import { DB_SIII } from '../../../shared/constants'

/**
 * Repositorio para felcn_siii.public.asignacion
 *
 * Implementa las queries de:
 *   - FRM-OP.aspx → muestradatos(): buscarPorId()
 *   - FRM-OP-ING.aspx → muestraoperativos(): buscarAprobadosPorUsuario()
 *   - FRM-OP-ING.aspx → muestranoaprob(): buscarNoAprobadosPorUsuario()
 *   - ICIA-SERV-01 → nroregistro(): contarPorDptoUnidadAnio()
 */
@Injectable()
export class AsignacionSiiiRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  private get repository() {
    return this.dataSource.getRepository(AsignacionSiii)
  }

  /**
   * FRM-OP.aspx → muestradatos()
   * SELECT Casos_Id, NombreCaso, FSolicitud, FonoS, AsigCaso, FonoA,
   *        FiscalAsigCaso, FonoF, NroOperativo, NroCaso
   * FROM ASIGNACION WHERE Casos_Id = X
   */
  async buscarPorId(idCaso: string): Promise<any | null> {
    const result = await this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.fiscal_solicitud AS "fiscalSolicitud",
        a.telefono_solicitud AS "telefonoSolicitud",
        a.asignado_caso AS "asignadoCaso",
        a.telefono_asignado AS "telefonoAsignado",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.telefono_fiscal AS "telefonoFiscal",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      WHERE a.id_caso = $1`,
      [idCaso]
    )
    return result[0] || null
  }

  /**
   * Listar todos los de un usuario.
   * Equivale a FRM-OP-ING.aspx → muestraoperativos() pero filtrando
   * solo los que tienen NroCaso no vacío.
   */
  async buscarCasosPorUsuario(usuario: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      WHERE a.usuario = $1
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [usuario]
    )
  }

  /**
   * Listar todos los de una unidad.
   */
  /**
   * Listar casos filtrados por investigador.
   * INNER JOIN INVESTIGADOR ON ASIGNACION.id_caso = INVESTIGADOR.id_caso
   * WHERE INVESTIGADOR.usuario = $1
   */
  async buscarCasosporInvestigador(usuario: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      INNER JOIN public.investigador i ON a.id_caso = i.id_caso
      WHERE i.usuario = $1
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [usuario]
    )
  }

  /**
   * Listar todos los de una unidad.
   */
  async buscarCasosPorUnidad(abreviaturaUnidad: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON dc.id_departamento_caso = a.id_departamento_caso
      WHERE TRIM(a.abreviatura_unidad) = TRIM($1) AND TRIM(COALESCE(a.numero_caso, '')) <> ''
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [abreviaturaUnidad]
    );
  }

  /**

  /**
   * Listar casos APROBADOS de un usuario (tienen numero_caso asignado).
   * Equivale a FRM-OP-ING.aspx → muestraoperativos() pero filtrando
   * solo los que tienen NroCaso no vacío.
   */
  async buscarAprobadosPorUsuario(usuario: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      WHERE a.usuario = $1 AND TRIM(COALESCE(a.numero_caso, '')) <> ''
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [usuario]
    )
  }

  /**
   * FRM-OP-ING.aspx → muestranoaprob()
   * SELECT Casos_Id, Uni_Descripcion, Dis_Descripcion, Grp_Descripcion,
   *        NroCaso, NroCasoPerDom, NroOperativo, NombreCaso, AsigCaso, FiscalAsigCaso
   * FROM ASIGNACION
   *   INNER JOIN UNIDADES    ON Uni_Abrev = Uni_Abrev
   *   INNER JOIN DISTRITALES ON Dis_Id = Dis_Id
   *   INNER JOIN GRUPOS      ON Grp_Id = Grp_Id
   * WHERE Usuario = X AND RTRIM(NroCaso) = ''
   * ORDER BY Uni_Descripcion, Dis_Descripcion, Grp_Descripcion
   */
  async buscarNoAprobadosPorUsuario(usuario: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      WHERE a.usuario = $1 AND TRIM(COALESCE(a.numero_caso, '')) = ''
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [usuario]
    )
  }

  /**
   * Post-Interoprabilidad
   */
  async buscarCasosConCudPorUsuario(usuario: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT
        a.id_caso AS "idCaso",
        COALESCE(u.descripcion, a.abreviatura_unidad) AS "unidadDescripcion",
        COALESCE(d.descripcion, '') AS "distritaleDescripcion",
        COALESCE(g.descripcion, '') AS "grupoDescripcion",
        a.numero_caso AS "numeroCaso",
        a.numero_caso_per_dom AS "numeroCasoPerDom",
        a.numero_operativo AS "numeroOperativo",
        a.nombre_caso AS "nombreCaso",
        a.asignado_caso AS "asignadoCaso",
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso",
        a.ianus AS "ianus",
        a.id_departamento_caso AS "idDepartamentoCaso",
        a.abreviatura_unidad AS "abreviaturaUnidad",
        a.id_distrital AS "idDistrital",
        a.id_grupo AS "idGrupo",
        dc.descripcion AS "departamento"
      FROM public.asignacion a
      LEFT JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura
      LEFT JOIN public.distrital d ON a.id_distrital = d.id_distrital
      LEFT JOIN public.grupo g ON a.id_grupo = g.id_grupo
      LEFT JOIN public.departamento_caso dc ON a.id_departamento_caso = dc.id_departamento_caso
      WHERE a.usuario = $1 AND TRIM(COALESCE(a.ianus, '')) <> ''
      ORDER BY u.descripcion, d.descripcion, g.descripcion`,
      [usuario]
    )
  }

  /**
   * ICIA-SERV-01 → nroregistro()
   * SELECT COUNT(Casos_Id) FROM ASIGNACION
   * WHERE DptoAv_Id = X AND Uni_Abrev = X AND NroOperativo LIKE '%/yy%'
   */
  async contarPorDptoUnidadAnio(
    idDepartamentoCaso: string,
    abreviaturaUnidad: string,
    anio: string
  ): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('asignacion')
      .select('COUNT(asignacion.idCaso)', 'total')
      .where('asignacion.idDepartamentoCaso = :idDepartamentoCaso', { idDepartamentoCaso })
      .andWhere('asignacion.abreviaturaUnidad = :abreviaturaUnidad', { abreviaturaUnidad })
      .andWhere('asignacion.numeroOperativo LIKE :patron', { patron: `%/${anio}%` })
      .getRawOne()
    return parseInt(result?.total ?? '0', 10)
  }
}
