import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoSujeto
 * Staging de sujetos del caso enviados por el MP (3.7 / 3.8).
 * El objeto persona_natural o persona_juridica completo vive en payload.
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_sujeto
 */
@Entity({ name: 'mp_caso_sujeto', schema: SCHEMA_FISCALIA })
export class MpCasoSujeto {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_caso_persona_id' })
  polCasoPersonaId: string

  @Column({ name: 'mp_caso_persona_id', type: 'bigint', unique: true })
  mpCasoPersonaId: string

  @Column({ name: 'pol_caso_id', type: 'bigint' })
  polCasoId: string

  @Column({ name: 'tipo_persona', type: 'varchar', length: 10 })
  tipoPersona: 'natural' | 'juridica'

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  numeroDocumento: string | null

  @Column({ name: 'nit', type: 'varchar', length: 30, nullable: true })
  nit: string | null

  @Column({ name: 'es_querellante', type: 'boolean', nullable: true })
  esQuerellante: boolean | null

  @Column({ name: 'reserva_identidad', type: 'boolean', nullable: true })
  reservaIdentidad: boolean | null

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
