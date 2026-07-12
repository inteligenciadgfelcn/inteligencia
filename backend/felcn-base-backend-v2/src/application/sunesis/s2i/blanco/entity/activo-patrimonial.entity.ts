import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AuditoriaEntity } from '@/common/entity'
import { S2iBlanco } from './blanco.entity'
import { S2iTipoActivo } from '../../parametrica/entity/tipo-activo.entity'

/**
 * Tabla: public.activo_patrimonial
 * Declaración patrimonial del blanco investigado, con archivo adjunto obligatorio
 * FK a blanco y a tipo_activo. Auditoría gestionada por triggers de BD.
 */
@Entity({ name: 'activo_patrimonial', schema: SCHEMA_PUBLIC })
export class S2iActivoPatrimonial extends AuditoriaEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_activo_patrimonial' })
  idActivoPatrimonial: string

  @Column({ name: 'id_blanco', type: 'bigint' })
  idBlanco: string

  @Column({ name: 'id_tipo_activo', type: 'smallint' })
  idTipoActivo: number

  @Column({ name: 'gestion', type: 'varchar', length: 4 })
  gestion: string

  @Column({ name: 'contenido', type: 'text' })
  contenido: string

  /** Archivo adjunto almacenado en bytea — se sirve vía GET .../descargar */
  @Column({ name: 'archivo', type: 'bytea' })
  archivo: Buffer

  @ManyToOne(() => S2iBlanco)
  @JoinColumn({ name: 'id_blanco' })
  blanco?: S2iBlanco

  @ManyToOne(() => S2iTipoActivo)
  @JoinColumn({ name: 'id_tipo_activo' })
  tipoActivo?: S2iTipoActivo

  constructor(data?: Partial<S2iActivoPatrimonial>) {
    super(data)
    if (data) Object.assign(this, data)
  }
}
