import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoAgenda
 * Staging de agenda de audiencias enviada por el MP (3.16b / 3.19 / 3.20).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_agenda
 */
@Entity({ name: 'mp_caso_agenda', schema: SCHEMA_FISCALIA })
export class MpCasoAgenda {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_agenda_id' })
  polAgendaId: string

  @Column({ name: 'pol_caso_id', type: 'bigint' })
  polCasoId: string

  @Column({ name: 'oj_audiencia_id', type: 'bigint' })
  ojAudienciaId: string

  @Column({
    name: 'oj_audiencia_detalle_id',
    type: 'bigint',
    unique: true,
  })
  ojAudienciaDetalleId: string

  @Column({ name: 'juzgado_id', type: 'integer' })
  juzgadoId: number

  @Column({ name: 'fecha_hora_inicio', type: 'timestamptz' })
  fechaHoraInicio: Date

  @Column({ name: 'fecha_hora_fin', type: 'timestamptz' })
  fechaHoraFin: Date

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
