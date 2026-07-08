import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpEventoRecepcion
 * Bitácora de toda petición recibida en los endpoints external/fiscalia.
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_evento_recepcion
 */
@Entity({ name: 'mp_evento_recepcion', schema: SCHEMA_FISCALIA })
export class MpEventoRecepcion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string

  @Column({ name: 'endpoint', type: 'varchar', length: 255 })
  endpoint: string

  @Column({ name: 'metodo', type: 'varchar', length: 10 })
  metodo: string

  @Column({ name: 'payload', type: 'jsonb', nullable: true })
  payload: Record<string, unknown> | null

  @Column({ name: 'respuesta', type: 'jsonb', nullable: true })
  respuesta: Record<string, unknown> | null

  @Column({ name: 'http_status', type: 'integer' })
  httpStatus: number

  @Column({ name: 'ip_origen', type: 'varchar', length: 64, nullable: true })
  ipOrigen: string | null

  @Column({
    name: 'api_key_alias',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  apiKeyAlias: string | null

  @Column({ name: 'duracion_ms', type: 'integer', nullable: true })
  duracionMs: number | null

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date
}
