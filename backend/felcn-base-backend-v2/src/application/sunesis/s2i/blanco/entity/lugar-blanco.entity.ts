import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { S2iBlanco } from './blanco.entity'

/**
 * Tabla: public.lugar_blanco
 * Ubicaciones GIS asociadas al blanco investigado
 * FK CASCADE a blanco
 */
@Entity({ name: 'lugar_blanco', schema: SCHEMA_PUBLIC })
export class S2iLugarBlanco {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_lugar_blanco' })
  idLugarBlanco: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'descripcion', type: 'varchar', length: 150 })
  descripcion: string

  @Column({ name: 'coordenas_x', type: 'double precision' })
  coordenadasX: number

  @Column({ name: 'coordenas_y', type: 'double precision' })
  coordenadasY: number

  @Column({ name: 'contenido', type: 'text' })
  contenido: string

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  constructor(data?: Partial<S2iLugarBlanco>) {
    if (data) Object.assign(this, data)
  }
}
