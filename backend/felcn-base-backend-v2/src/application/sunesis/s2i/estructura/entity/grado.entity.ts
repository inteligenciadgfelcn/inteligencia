import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad Grado
 * Base de datos: felcn_s2i
 * Tabla: grado
 * Script: database/scripts/felcn_s2i.sql
 */
@Entity({ name: 'grado' })
export class Grado {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_grado' })
  idGrado: number

  @Column({ name: 'abreviatura', type: 'varchar', length: 20 })
  abreviatura: string

  @Column({ name: 'descripcion', type: 'varchar', length: 50 })
  descripcion: string
}
