import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'

@Injectable()
export class CasosParalelosRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private dataSource: DataSource
  ) { }

  /**
   * Busca casos por unidad y número de caso (Lógica SQL legacy)
   * SELECT ASIGNACION.Casos_Id AS Cas1, UNIDADES.Uni_Descripcion AS Cas2, DISTRITALES.Dis_Descripcion AS Cas3, ASIGNACION.NroOperativo AS Cas4, ASIGNACION.NombreCaso AS Cas5, ASIGNACION.NroCaso AS Cas6, ASIGNACION.AsigCaso AS Cas7, ASIGNACION.FiscalAsigCaso AS Cas8
   * FROM ASIGNACION 
   * INNER JOIN UNIDADES ON ASIGNACION.Uni_Abrev = UNIDADES.Uni_Abrev 
   * INNER JOIN DISTRITALES ON ASIGNACION.Dis_Id = DISTRITALES.Dis_Id
   * WHERE (ASIGNACION.Uni_Abrev = :unidad) AND (ASIGNACION.NroCaso = :numeroCaso) 
   * ORDER BY Cas1
   */
  async buscarPorUnidadYNumeroCaso(unidad: string, numeroCaso: string): Promise<any[]> {
    return this.dataSource.query(
      `SELECT 
        a.id_caso AS "idCaso", 
        u.descripcion AS "unidadDescripcion", 
        d.descripcion AS "distritaleDescripcion", 
        a.numero_operativo AS "numeroOperativo", 
        a.nombre_caso AS "nombreCaso", 
        a.numero_caso AS "numeroCaso", 
        a.asignado_caso AS "asignadoCaso", 
        a.fiscal_asignado_caso AS "fiscalAsignadoCaso"
      FROM public.asignacion a 
      INNER JOIN public.unidad u ON a.abreviatura_unidad = u.abreviatura 
      INNER JOIN public.distrital d ON a.id_distrital = d.id_distrital
      WHERE a.abreviatura_unidad = $1 AND a.numero_caso = $2
      ORDER BY a.id_caso`,
      [unidad, numeroCaso]
    )
  }
}
