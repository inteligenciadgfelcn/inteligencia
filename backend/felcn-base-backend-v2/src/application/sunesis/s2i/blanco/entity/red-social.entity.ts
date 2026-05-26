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
 * Tabla: public.red_social
 * Perfiles de redes sociales del blanco investigado
 * FK CASCADE a blanco
 */
@Entity({ name: 'red_social', schema: SCHEMA_PUBLIC })
export class S2iRedSocial {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_red_social' })
  idRedSocial: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'tipo_red', type: 'varchar', length: 50 })
  tipoRed: string

  @Column({ name: 'direccion', type: 'varchar', length: 200 })
  direccion: string

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  constructor(data?: Partial<S2iRedSocial>) {
    if (data) Object.assign(this, data)
  }
}
