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
 *   - FRM-OP-ING.aspx → muestranoaprob(): buscarNoAprobadosPorUsuario()
 *   - ICIA-SERV-01 → nroregistro(): contarPorDptoUnidadAnio()
 */
@Injectable()
export class AsignacionSiiiRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) {}

  private get repository() {
    return this.dataSource.getRepository(AsignacionSiii)
  }

  /**
   * FRM-OP.aspx → muestradatos()
   * SELECT Casos_Id, NombreCaso, FSolicitud, FonoS, AsigCaso, FonoA,
   *        FiscalAsigCaso, FonoF, NroOperativo, NroCaso
   * FROM ASIGNACION WHERE Casos_Id = X
   */
  async buscarPorId(idCaso: string): Promise<AsignacionSiii | null> {
    return this.repository.findOne({ where: { idCaso } })
  }

  /**
   * FRM-OP-ING.aspx → muestranoaprob()
   * SELECT Casos_Id, Uni_Descripcion, Dis_Descripcion, Grp_Descripcion,
   *        NroCaso, NroOperativo, NombreCaso, AsigCaso, FiscalAsigCaso
   * FROM ASIGNACION
   *   INNER JOIN UNIDADES    ON Uni_Abrev = Uni_Abrev
   *   INNER JOIN DISTRITALES ON Dis_Id = Dis_Id
   *   INNER JOIN GRUPOS      ON Grp_Id = Grp_Id
   * WHERE Usuario = X AND RTRIM(NroCaso) = ''
   * ORDER BY Uni_Descripcion, Dis_Descripcion, Grp_Descripcion
   */
  async buscarNoAprobadosPorUsuario(usuario: string): Promise<AsignacionSiii[]> {
    return this.repository
      .createQueryBuilder('asignacion')
      .where('asignacion.usuario = :usuario', { usuario })
      .andWhere("TRIM(asignacion.numeroCaso) = ''")
      .orderBy('asignacion.abreviaturaUnidad', 'ASC')
      .addOrderBy('asignacion.idDistrital', 'ASC')
      .addOrderBy('asignacion.idGrupo', 'ASC')
      .getMany()
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
