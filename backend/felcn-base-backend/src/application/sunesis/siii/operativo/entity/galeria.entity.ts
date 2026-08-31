import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { Operativo } from './operativo.entity'

/**
 * Entidad Galería
 * Fotos del operativo
 * Base de datos: felcn_iii
 * Schema: public
 * Tabla: galeria
 */
@Entity({ name: 'galeria', schema: SCHEMA_PUBLIC })
export class Galeria extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_galeria' })
  id: string

  @Column({ name: 'id_operativo', type: 'bigint' })
  idOperativo: string

  @Column({ name: 'descripcion', type: 'varchar', length: 100 })
  descripcion: string

  @Column({ name: 'foto', type: 'bytea' })
  foto: Buffer

  @ManyToOne(() => Operativo)
  @JoinColumn({ name: 'id_operativo' })
  operativo?: Operativo

  constructor(data?: Partial<Galeria>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
