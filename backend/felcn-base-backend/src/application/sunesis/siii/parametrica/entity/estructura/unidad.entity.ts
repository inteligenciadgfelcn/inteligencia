import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_AUTH_FDW } from '../../../../shared/constants'

/**
 * Entidad Unidad
 * Base de datos: felcn_siii / Tabla foránea: auth_fdw.unidad → parametro.unidad (felcn_auth_v3)
 * Fuente ASP: SELECT Uni_Id, Uni_Descripcion FROM UNIDADES
 * Combo: cbounidad
 */
@Entity({ name: 'unidad', schema: SCHEMA_AUTH_FDW })
export class Unidad {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 20 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string

  @Column({ name: 'es_operativa_admin', type: 'boolean' })
  esOperativaAdmin: boolean
}
