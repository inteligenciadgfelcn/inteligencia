import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'
import { AsignacionSiii } from '../../asignacion/entity/asignacion-siii.entity'

/**
 * Entidad Investigador
 * Base de datos: felcn_siii
 * Schema: public
 * Tabla: investigador
 */
@Entity({ name: 'investigador', schema: SCHEMA_PUBLIC })
export class Investigador extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_investigador' })
  id: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @Column({ name: 'id_grado', type: 'integer' })
  idGrado: number

  @Column({ name: 'nombre_app', type: 'varchar', length: 200 })
  nombreApp: string

  @Column({ name: 'telefono_celular', type: 'varchar', length: 10 })
  telefonoCelular: string

  @Column({ name: 'telefono_fijo', type: 'varchar', length: 10 })
  telefonoFijo: string

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date

  @Column({ name: 'es_actual', type: 'boolean' })
  esActual: boolean

  @Column({ name: 'info_actualizada', type: 'text' })
  infoActualizada: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario_sistema', type: 'varchar', length: 15 })
  usuarioSistema: string

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  @ManyToOne(() => AsignacionSiii)
  @JoinColumn({ name: 'id_caso' })
  asignacion: AsignacionSiii

  constructor(data?: Partial<Investigador>) {
    super()
    if (data) Object.assign(this, data)
  }
}
