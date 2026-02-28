import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Unidad } from './unidad.entity'

/**
 * Entidad Distrital
 * Base de datos: felcn_s3i
 * Tabla: distrital
 */
@Entity({ name: 'distrital' })
export class Distrital {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_distrital' })
  id: number

  @Column({ name: 'id_unidad', type: 'integer' })
  idUnidad: number

  @Column({ name: 'descripcion', type: 'varchar', length: 80 })
  descripcion: string

  @ManyToOne(() => Unidad)
  @JoinColumn({ name: 'id_unidad' })
  unidad: Unidad
}
