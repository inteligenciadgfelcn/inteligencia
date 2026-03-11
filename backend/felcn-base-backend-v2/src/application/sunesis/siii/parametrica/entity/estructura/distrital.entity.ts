import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'

/**
 * Entidad Distrital
 * Base de datos: felcn_siii
 * Schema: public / Tabla: distrital
 * Fuente ASP: SELECT Dis_Id, Dis_Descripcion FROM DISTRITALES WHERE (Uni_Id = X)
 * Combo: cboDistrital (dependiente de cbounidad)
 */
@Entity({ name: 'distrital', schema: SCHEMA_PUBLIC })
export class Distrital {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_distrital' })
  id: number

  @Column({ name: 'id_unidad', type: 'integer' })
  idUnidad: number

  @Column({ name: 'descripcion', type: 'varchar', length: 80 })
  descripcion: string
}
