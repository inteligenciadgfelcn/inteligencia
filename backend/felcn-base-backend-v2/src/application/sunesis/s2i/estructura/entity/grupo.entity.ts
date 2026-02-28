import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Distrital } from './distrital.entity'

/**
 * Entidad Grupo
 * Base de datos: felcn_s3i
 * Tabla: grupo
 */
@Entity({ name: 'grupo' })
export class Grupo {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_grupo' })
  idGrupo: number

  @Column({ name: 'id_distrital', type: 'integer' })
  idDistrital: number

  @Column({ name: 'descripcion', type: 'varchar', length: 75 })
  descripcion: string

  @ManyToOne(() => Distrital)
  @JoinColumn({ name: 'id_distrital' })
  distrital: Distrital
}
