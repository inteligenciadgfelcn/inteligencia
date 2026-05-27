import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

@Entity({ name: 'vehiculo', schema: SCHEMA_PUBLIC })
export class S2iVehiculo {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_vehiculo' })
  idVehiculo: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'propietario', type: 'varchar', length: 150 })
  propietario: string

  @Column({ name: 'placa', type: 'varchar', length: 10 })
  placa: string

  @Column({ name: 'color', type: 'varchar', length: 20 })
  color: string

  @Column({ name: 'marca', type: 'varchar', length: 20 })
  marca: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  constructor(data?: Partial<S2iVehiculo>) {
    if (data) Object.assign(this, data)
  }
}
