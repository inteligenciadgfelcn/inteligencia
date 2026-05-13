import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { DetenidoAuxiliar } from './detenido-auxiliar.entity'
import { SituacionLegal } from '../../../parametrica/entity/sustancia/situacion-legal.entity'

/**
 * Entidad Situacion
 * Historial de situaciones legales de un implicado.
 * Origen: FRM-JUR-02.aspx.cs — btnsituacion_Click / Muestrasitu
 * Tabla: public.situacion
 */
@Entity({ name: 'situacion', schema: SCHEMA_PUBLIC })
export class Situacion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_situacion' })
  id: string

  @Column({ name: 'id_detenido_auxiliar', type: 'bigint' })
  idDetenidoAuxiliar: string

  @Column({ name: 'id_situacion_legal', type: 'integer' })
  idSituacionLegal: number

  @Column({ name: 'nro_resolucion', type: 'varchar', length: 50 })
  nroResolucion: string

  @Column({ name: 'lugar', type: 'varchar', length: 100 })
  lugar: string

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date

  @Column({ name: 'autoridad', type: 'varchar', length: 150 })
  autoridad: string

  @Column({ name: 'fjt', type: 'varchar', length: 100 })
  fjt: string

  @Column({ name: 'upd_inf', type: 'text' })
  updInf: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => DetenidoAuxiliar)
  @JoinColumn({ name: 'id_detenido_auxiliar' })
  detenidoAuxiliar?: DetenidoAuxiliar

  @ManyToOne(() => SituacionLegal)
  @JoinColumn({ name: 'id_situacion_legal' })
  situacionLegal?: SituacionLegal

  constructor(data?: Partial<Situacion>) {
    if (data) Object.assign(this, data)
  }
}
