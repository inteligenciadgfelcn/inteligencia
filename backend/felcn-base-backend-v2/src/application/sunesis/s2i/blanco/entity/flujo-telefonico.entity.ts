import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { S2iBlanco } from './blanco.entity'

/**
 * Tabla: public.flujo_telefonico
 * Registro de flujo telefónico (empresa/línea) asociado a un blanco investigado
 * FK a blanco. Auditoría (_usuario_creacion, _fecha_creacion, etc.) gestionada
 * por los triggers de BD fn_auditoria_before_insert/fn_auditoria_before_update.
 */
@Entity({ name: 'flujo_telefonico', schema: SCHEMA_PUBLIC })
export class S2iFlujoTelefonico extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_flujo' })
  idFlujo: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'empresa', type: 'varchar', length: 15 })
  empresa: string

  @Column({ name: 'direccion', type: 'varchar', length: 50 })
  direccion: string

  @Column({ name: 'numero', type: 'varchar', length: 15 })
  numero: string

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  constructor(data?: Partial<S2iFlujoTelefonico>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
