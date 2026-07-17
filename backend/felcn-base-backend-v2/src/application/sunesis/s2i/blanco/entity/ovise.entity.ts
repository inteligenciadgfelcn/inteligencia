import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { S2iBlanco } from './blanco.entity'

/**
 * Tabla: public.ovise
 * Reporte de seguimiento georreferenciado del blanco investigado
 * FK a blanco. Auditoría gestionada por triggers de BD.
 */
@Entity({ name: 'ovise', schema: SCHEMA_PUBLIC })
export class S2iOvise extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_ovise' })
  idOvise: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'lugar', type: 'varchar', length: 50 })
  lugar: string

  @Column({ name: 'latitud', type: 'float8' })
  latitud: number

  @Column({ name: 'longitud', type: 'float8' })
  longitud: number

  @Column({ name: 'reporte', type: 'text' })
  reporte: string

  @Column({ name: 'accion', type: 'varchar', length: 20 })
  accion: string

  /** Archivo adjunto almacenado en bytea (opcional) — se sirve vía GET .../descargar */
  @Column({ name: 'archivo', type: 'bytea', nullable: true })
  archivo?: Buffer

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  constructor(data?: Partial<S2iOvise>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
