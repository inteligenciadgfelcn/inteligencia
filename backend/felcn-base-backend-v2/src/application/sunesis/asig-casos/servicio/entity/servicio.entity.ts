import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm'

/**
 * Entidad Servicio
 * Base de datos: felcn_asignacion_caso
 * Tabla: servicio
 * Script: database/scripts/felcn_asignacion_caso.sql
 */
@Entity({ name: 'servicio' })
export class Servicio {
  @PrimaryColumn({ name: 'codigo_servicio', type: 'varchar', length: 50 })
  codigoServicio: string

  @Column({ name: 'usuario_login', type: 'char', length: 15 })
  usuarioLogin: string

  @Column({ name: 'usuario_ejecutor', type: 'char', length: 15 })
  usuarioEjecutor: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'fecha_hora_salida', type: 'timestamp' })
  fechaHoraSalida: Date

  @BeforeInsert()
  insertarFechaIngreso() {
    if (!this.fechaHoraIngreso) {
      this.fechaHoraIngreso = new Date()
    }
  }

  constructor(data?: Partial<Servicio>) {
    if (data) Object.assign(this, data)
  }
}
