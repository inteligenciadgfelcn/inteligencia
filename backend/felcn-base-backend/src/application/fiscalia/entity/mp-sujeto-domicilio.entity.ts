import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpSujetoDomicilio
 * Staging de domicilios del sujeto enviados por el MP (3.12).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_sujeto_domicilio
 */
@Entity({ name: 'mp_sujeto_domicilio', schema: SCHEMA_FISCALIA })
export class MpSujetoDomicilio {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_persona_residencia_id' })
  polPersonaResidenciaId: string

  @Column({ name: 'mp_persona_domicilio_id', type: 'bigint', unique: true })
  mpPersonaDomicilioId: string

  @Column({ name: 'pol_caso_persona_id', type: 'bigint' })
  polCasoPersonaId: string

  @Column({ name: 'pais_id', type: 'integer' })
  paisId: number

  @Column({ name: 'municipio_id', type: 'integer', nullable: true })
  municipioId: number | null

  @Column({ name: 'homologado', type: 'boolean', default: false })
  homologado: boolean

  @Column({ name: 'payload', type: 'jsonb' })
  payload: Record<string, unknown>

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date
}
