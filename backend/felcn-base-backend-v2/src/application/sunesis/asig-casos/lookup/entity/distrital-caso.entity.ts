import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

/**
 * Entidad DistritalCaso
 * Base de datos: felcn_asignacion_casos
 * Tabla: distrital
 */
@Entity({ name: 'distrital' })
export class DistritalCaso {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_distrital' })
  idDistrital: number

  @Column({ name: 'id_unidad', type: 'char', length: 2 })
  idUnidad: string

  @Column({ name: 'descripcion', type: 'varchar', length: 80 })
  descripcion: string
}
