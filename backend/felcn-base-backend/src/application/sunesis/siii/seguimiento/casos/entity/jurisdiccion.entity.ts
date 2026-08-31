import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AsignacionSiii } from '../../../asignacion/entity/asignacion-siii.entity'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'

/**
 * Entidad Jurisdiccion
 * Historial de las jurisdicciones por las que ha pasado un caso.
 * Tabla: jurisdiccion
 */
@Entity({ name: 'jurisdiccion', schema: SCHEMA_PUBLIC })
export class Jurisdiccion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_jurisdiccion' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date

  @Column({ name: 'jurisdiccion', type: 'varchar', length: 100 })
  jurisdiccion: string

  @Column({ name: 'observacion', type: 'varchar', length: 150 })
  observacion: string

  @Column({ name: 'es_actual', type: 'bool' })
  esActual: boolean

  @Column({ name: 'info_actualizada', type: 'text' })
  infoActualizada: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @ManyToOne(() => AsignacionSiii)
  @JoinColumn({ name: 'id_caso' })
  asignacion: AsignacionSiii

  constructor(data?: Partial<Jurisdiccion>) {
    if (data) Object.assign(this, data)
  }
}
