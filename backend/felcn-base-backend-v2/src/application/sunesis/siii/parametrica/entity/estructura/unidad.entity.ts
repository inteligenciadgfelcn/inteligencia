import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'

/**
 * Entidad Unidad
 * Base de datos: felcn_siii
 * Schema: public / Tabla: unidad
 * Fuente ASP: SELECT Uni_Id, Uni_Descripcion FROM UNIDADES
 * Combo: cbounidad
 */
@Entity({ name: 'unidad', schema: SCHEMA_PUBLIC })
export class Unidad {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_unidad' })
  id: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 3 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 80 })
  descripcion: string

  @Column({ name: 'abreviatura_icia', type: 'varchar', length: 2 })
  abreviaturaIcia: string

  @Column({ name: 'es_operativa_admin', type: 'boolean' })
  esOperativaAdmin: boolean

  @Column({ name: 'abreviatura_reporte', type: 'varchar', length: 10 })
  abreviaturaReporte: string
}
