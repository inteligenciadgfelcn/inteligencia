import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'

@Entity({ name: 'presedencia' })
export class PresedenciaLgi {
  @PrimaryGeneratedColumn({
    name: 'prese_id',
    type: 'bigint',
  })
  preseId!: string

  @Column({
    name: 'casos_id',
    type: 'bigint',
  })
  casosId!: string

  @Column({
    name: 'nrocasopre',
    type: 'varchar',
    length: 20,
  })
  nrocasopre!: string

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 10,
    default: 'ACTIVO',
  })
  estado!: string

  @CreateDateColumn({
    name: 'fechahoraing',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraIng!: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 15,
  })
  usuario!: string

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  usuarioActualizacion!: string | null

  @UpdateDateColumn({
    name: 'fecha_actualizacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaActualizacion!: Date
}
