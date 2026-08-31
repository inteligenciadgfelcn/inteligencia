import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCaso
 * Staging de casos enviados por el Ministerio Público (3.1 / 3.2).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso
 * El payload JSONB conserva el body completo recibido; la homologación
 * hacia las tablas operativas del SIII es diferida (Fase B).
 */
@Entity({ name: 'mp_caso', schema: SCHEMA_FISCALIA })
export class MpCaso {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_caso_id' })
  polCasoId: string

  @Column({ name: 'mp_caso_id', type: 'bigint', unique: true })
  mpCasoId: string

  @Column({ name: 'cud', type: 'varchar', length: 50 })
  cud: string

  @Column({ name: 'mp_caso_padre_id', type: 'bigint', nullable: true })
  mpCasoPadreId: string | null

  @Column({ name: 'esta_reservado', type: 'boolean', default: false })
  estaReservado: boolean

  @Column({ name: 'fecha_fin_reserva', type: 'timestamptz', nullable: true })
  fechaFinReserva: Date | null

  @Column({ name: 'estado', type: 'smallint', default: 1 })
  estado: number

  @Column({ name: 'homologado', type: 'boolean', default: false })
  homologado: boolean

  @Column({ name: 'payload', type: 'jsonb' })
  payload: Record<string, unknown>

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date
}
