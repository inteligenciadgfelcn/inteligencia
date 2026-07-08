import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoActividad
 * Staging de actividades / actos investigativos enviados por el MP (3.15).
 * El objeto meta_data polimórfico completo vive en payload.
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_actividad
 */
@Entity({ name: 'mp_caso_actividad', schema: SCHEMA_FISCALIA })
export class MpCasoActividad {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_caso_actividad_id' })
  polCasoActividadId: string

  @Column({ name: 'mp_caso_actividad_id', type: 'bigint', unique: true })
  mpCasoActividadId: string

  @Column({ name: 'pol_caso_id', type: 'bigint' })
  polCasoId: string

  @Column({ name: 'actividad_id', type: 'integer' })
  actividadId: number

  @Column({ name: 'archivo_hash', type: 'varchar', length: 255 })
  archivoHash: string

  @Column({ name: 'tipo_solicitud_id', type: 'integer', nullable: true })
  tipoSolicitudId: number | null

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
