import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'asignacion' })
export class AsignacionLgi {
  @PrimaryGeneratedColumn({
    name: 'casos_id',
    type: 'bigint',
  })
  casosId!: number

  @Column({
    name: 'dptoav_id',
    type: 'varchar',
    length: 2,
  })
  dptoavId!: string

  @Column({
    name: 'uni_abrev',
    type: 'varchar',
    length: 3,
  })
  uniAbrev!: string

  @Column({
    name: 'dis_id',
    type: 'bigint',
  })
  disId!: number

  @Column({
    name: 'nombrecaso',
    type: 'varchar',
    length: 30,
  })
  nombreCaso!: string

  @Column({
    name: 'tipocaso',
    type: 'varchar',
    length: 30,
  })
  tipoCaso!: string

  @Column({
    name: 'nrocasogiaef',
    type: 'varchar',
    length: 20,
  })
  nroCasoGlaef!: string

  @Column({
    name: 'nrocaso',
    type: 'varchar',
    length: 20,
  })
  nroCaso!: string

  @Column({
    name: 'nrocasofis',
    type: 'varchar',
    length: 20,
  })
  nroCasoFis!: string

  @Column({
    name: 'ti_pen_id',
    type: 'bigint',
  })
  tiPenId!: string

  @Column({
    name: 'nrocasoifp',
    type: 'varchar',
    length: 20,
  })
  nroCasoIfp!: string

  @Column({
    name: 'cudifp',
    type: 'varchar',
    length: 20,
  })
  cudIfp!: string

  @Column({
    name: 'perddom',
    type: 'boolean',
  })
  perddom!: boolean

  @Column({
    name: 'nrocasoperdom',
    type: 'varchar',
    length: 20,
  })
  nroCasoPerdom!: string

  @Column({
    name: 'ianus',
    type: 'varchar',
    length: 15,
  })
  ianus!: string

  @Column({
    name: 'eta_inv',
    type: 'bigint',
  })
  etaInv!: string

  @Column({
    name: 'remitefiscal',
    type: 'varchar',
    length: 70,
  })
  remiteFiscal!: string

  @Column({
    name: 'remitefecha',
    type: 'timestamp without time zone',
  })
  remiteFecha!: Date

  @Column({
    name: 'conformea',
    type: 'varchar',
    length: 70,
  })
  conformeA!: string

  @Column({
    name: 'fechainicio',
    type: 'timestamp without time zone',
  })
  fechaInicio!: Date

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
