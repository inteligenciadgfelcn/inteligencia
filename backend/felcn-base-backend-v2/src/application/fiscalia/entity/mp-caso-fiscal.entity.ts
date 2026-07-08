import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { SCHEMA_FISCALIA } from '../shared/constants'

/**
 * Entidad MpCasoFiscal
 * Staging de fiscales del caso enviados por el MP (3.13 / 3.14 —
 * "investigadores" en el documento del convenio).
 * Base de datos: felcn_siii — Schema: fiscalia — Tabla: mp_caso_fiscal
 */
@Entity({ name: 'mp_caso_fiscal', schema: SCHEMA_FISCALIA })
export class MpCasoFiscal {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pol_caso_funcionario_id' })
  polCasoFuncionarioId: string

  @Column({ name: 'mp_caso_funcionario_id', type: 'bigint', unique: true })
  mpCasoFuncionarioId: string

  @Column({ name: 'pol_caso_id', type: 'bigint' })
  polCasoId: string

  @Column({ name: 'ci', type: 'varchar', length: 30 })
  ci: string

  @Column({ name: 'tipo_responsable_id', type: 'integer' })
  tipoResponsableId: number

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
