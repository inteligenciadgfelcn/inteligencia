import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_AUTH_FDW } from '../../../../shared/constants'

/**
 * Entidad Grupo
 * Base de datos: felcn_siii / Tabla foránea: auth_fdw.grupo → parametro.grupo (felcn_auth_v3)
 * Fuente ASP: SELECT Grp_Id, Descripcion FROM GRUPOS WHERE (Dis_Id = X)
 * Combo: cboGrupo (dependiente de cboDistrital)
 */
@Entity({ name: 'grupo', schema: SCHEMA_AUTH_FDW })
export class Grupo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string
}
