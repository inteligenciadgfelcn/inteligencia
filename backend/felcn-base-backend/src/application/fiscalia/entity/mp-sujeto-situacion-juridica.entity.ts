import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpSujetoSituacionJuridica
 * Staging de situaciones jurídicas del sujeto enviadas por el MP (3.11).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_sujeto_situacion_juridica
 */
@Entity({ name: 'mp_sujeto_situacion_juridica', schema: SCHEMA_FISCALIA })
export class MpSujetoSituacionJuridica {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'pol_caso_persona_situacion_juridica_id',
  })
  polCasoPersonaSituacionJuridicaId: string

  @Column({
    name: 'mp_caso_persona_situacion_juridica_id',
    type: 'bigint',
    unique: true,
  })
  mpCasoPersonaSituacionJuridicaId: string

  @Column({ name: 'pol_caso_persona_id', type: 'bigint' })
  polCasoPersonaId: string

  @Column({ name: 'situacion_juridica_id', type: 'integer' })
  situacionJuridicaId: number

  @Column({ name: 'fecha_inicio', type: 'timestamptz' })
  fechaInicio: Date

  @Column({ name: 'homologado', type: 'boolean', default: false })
  homologado: boolean

  @Column({ name: 'payload', type: 'jsonb' })
  payload: Record<string, unknown>

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date
}
