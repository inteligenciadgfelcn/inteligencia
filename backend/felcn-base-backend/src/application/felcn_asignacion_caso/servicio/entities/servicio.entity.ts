import { Estado } from '@/application/felcn_siii/estado.enum'
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'servicio', schema: 'public' })
export class Servicio {
  @PrimaryColumn({
    type: 'varchar',
    length: 50,
    nullable: false,
    name: 'codigo_servicio',
    comment: 'Codigo de servicio',
  })
  codigoServicio: string

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    name: 'usuario_principal',
    comment: 'Usuario principal del servicio',
  })
  usuarioPrincipal: string

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    name: 'usuario_emergencia',
    comment: 'Usuario de emergencia del servicio',
  })
  usuarioEmergencia: string

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'fecha_hora_ingreso',
    comment: 'Fecha de ingreso al servicio',
  })
  fechaIngreso: Date

  @Column({
    type: 'timestamp',
    nullable: false,
    name: 'fecha_hora_salida',
    comment: 'Fecha de salida del servicio',
  })
  fechaSalida: Date

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
    comment: 'Estado del registro',
  })
  estado: Estado

  @BeforeInsert()
  setEstadoPorDefecto() {
    if (!this.estado) {
      this.estado = Estado.ACTIVO
    }
  }
}
