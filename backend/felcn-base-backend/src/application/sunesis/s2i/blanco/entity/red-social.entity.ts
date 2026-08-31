import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
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

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  constructor(data?: Partial<S2iRedSocial>) {
    if (data) Object.assign(this, data)
  }
}
