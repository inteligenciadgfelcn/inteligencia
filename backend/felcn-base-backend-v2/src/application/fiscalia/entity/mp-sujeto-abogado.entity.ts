import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpSujetoAbogado
 * Staging de abogados del sujeto enviados por el MP (3.9 / 3.10).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_sujeto_abogado
 */
@Entity({ name: 'mp_sujeto_abogado', schema: SCHEMA_FISCALIA })
export class MpSujetoAbogado {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'pol_caso_persona_abogado_id',
  })
  polCasoPersonaAbogadoId: string

  @Column({ name: 'mp_caso_persona_abogado_id', type: 'bigint', unique: true })
  mpCasoPersonaAbogadoId: string

  @Column({ name: 'pol_caso_persona_id', type: 'bigint' })
  polCasoPersonaId: string

  @Column({ name: 'ci', type: 'varchar', length: 30 })
  ci: string

  @Column({ name: 'codigo_rpa', type: 'varchar', length: 30 })
  codigoRpa: string

  @Column({ name: 'motivo_baja', type: 'varchar', length: 255, nullable: true })
  motivoBaja: string | null

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
