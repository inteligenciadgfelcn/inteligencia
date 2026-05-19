import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_AUTH_FDW } from '../../../../shared/constants'

/**
 * Entidad Distrital
 * Base de datos: felcn_siii / Tabla foránea: auth_fdw.distrital → parametro.distrital (felcn_auth_v3)
 * Fuente ASP: SELECT Dis_Id, Dis_Descripcion FROM DISTRITALES WHERE (Uni_Id = X)
 * Combo: cboDistrital (dependiente de cbounidad)
 */
@Entity({ name: 'distrital', schema: SCHEMA_AUTH_FDW })
export class Distrital {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @Column({ name: 'id_unidad', type: 'integer' })
  idUnidad: number

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string
}
