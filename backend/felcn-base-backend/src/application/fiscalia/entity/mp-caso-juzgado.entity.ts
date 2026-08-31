import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoJuzgado
 * Historial de asignaciones de juzgado a caso o a sujeto (3.17 / 3.18).
 * Cada PUT agrega un registro; el vigente es el más reciente.
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_juzgado
 */
@Entity({ name: 'mp_caso_juzgado', schema: SCHEMA_FISCALIA })
export class MpCasoJuzgado {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string

  @Column({ name: 'pol_caso_id', type: 'bigint', nullable: true })
  polCasoId: string | null

  @Column({ name: 'pol_caso_persona_id', type: 'bigint', nullable: true })
  polCasoPersonaId: string | null

  @Column({ name: 'juzgado_id', type: 'integer' })
  juzgadoId: number

  @Column({ name: 'homologado', type: 'boolean', default: false })
  homologado: boolean

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date
}
