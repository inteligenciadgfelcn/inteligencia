import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoDelito
 * Staging de delitos del caso enviados por el MP (3.3–3.6).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_delito
 */
@Entity({ name: 'mp_caso_delito', schema: SCHEMA_FISCALIA })
export class MpCasoDelito {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_caso_delito_id' })
  polCasoDelitoId: string

  @Column({ name: 'mp_caso_delito_id', type: 'bigint', unique: true })
  mpCasoDelitoId: string

  @Column({ name: 'pol_caso_id', type: 'bigint' })
  polCasoId: string

  @Column({ name: 'delito_id', type: 'integer' })
  delitoId: number

  @Column({ name: 'es_principal', type: 'boolean', nullable: true })
  esPrincipal: boolean | null

  @Column({ name: 'es_tentativo', type: 'boolean', nullable: true })
  esTentativo: boolean | null

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
