import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../shared/constants'

@Entity({ name: 'telefono', schema: SCHEMA_PUBLIC })
export class S2iTelefono {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_telefono' })
  idTelefono: string

  @Column({ name: 'id_caso', type: 'bigint' })
  idCaso: string

  @Column({ name: 'numero_1', type: 'varchar', length: 20 })
  numero1: string

  @Column({ name: 'propietario_1', type: 'varchar', length: 150 })
  propietario1: string

  @Column({ name: 'mensaje', type: 'text' })
  mensaje: string

  @Column({ name: 'numero_2', type: 'varchar', length: 20 })
  numero2: string

  @Column({ name: 'propietario_2', type: 'varchar', length: 150 })
  propietario2: string

  @Column({ name: 'fecha_hora_ingreso', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @BeforeInsert()
  setFechaIngreso() {
    if (!this.fechaHoraIngreso) this.fechaHoraIngreso = new Date()
  }

  constructor(data?: Partial<S2iTelefono>) {
    if (data) Object.assign(this, data)
  }
}
