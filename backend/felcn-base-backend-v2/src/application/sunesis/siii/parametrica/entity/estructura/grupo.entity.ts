import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'

/**
 * Entidad Grupo
 * Base de datos: felcn_siii
 * Schema: public / Tabla: grupo
 * Fuente ASP: SELECT Grp_Id, Descripcion FROM GRUPOS WHERE (Dis_Id = X)
 * Combo: cboGrupo (dependiente de cboDistrital)
 */
@Entity({ name: 'grupo', schema: SCHEMA_PUBLIC })
export class Grupo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_grupo' })
  id: number

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string
}
