import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { AsignacionSiii } from '../../asignacion/entity/asignacion-siii.entity'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

/**
 * Entidad Fiscal
 * Representa el historial de fiscales asignados a un caso.
 * Tabla: fiscal
 */
@Entity({ name: 'fiscal', schema: SCHEMA_PUBLIC })
export class Fiscal {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_fiscal' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'nombre_apellidos', type: 'varchar', length: 150 })
  nombreApellidos: string

  @Column({ name: 'telefono_celular', type: 'varchar', length: 10 })
  telefonoCelular: string

  @Column({ name: 'telefono_fijo', type: 'varchar', length: 10 })
  telefonoFijo: string

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

  constructor(data?: Partial<Fiscal>) {
    if (data) Object.assign(this, data)
  }
}
