import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AsignacionSiii } from '../../asignacion/entity/asignacion-siii.entity'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad ControlJurisdiccional
 * Registro histórico de los juzgados y tribunales que intervienen en el caso.
 * Tabla: control_jurisdiccional
 */
@Entity({ name: 'control_jurisdiccional', schema: SCHEMA_PUBLIC })
export class ControlJurisdiccional {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_control_jurisdiccional' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'juzgado_instruccion', type: 'varchar', length: 100 })
  juzgadoInstruccion: string

  @Column({ name: 'juzgado_partido', type: 'varchar', length: 100 })
  juzgadoPartido: string

  @Column({ name: 'tribunal_sentencia', type: 'varchar', length: 100 })
  tribunalSentencia: string

  @Column({ name: 'juzgado_ejecucion', type: 'varchar', length: 100 })
  juzgadoEjecucion: string

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date

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

  constructor(data?: Partial<ControlJurisdiccional>) {
    if (data) Object.assign(this, data)
  }
}
