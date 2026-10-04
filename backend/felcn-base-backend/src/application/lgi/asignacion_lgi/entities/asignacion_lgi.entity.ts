import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EtapaLgi } from '../../parametro/etapa/entities/etapa.entity'

@Entity({ schema: 'public', name: 'asignacion' })
export class AsignacionLgi {
  @PrimaryGeneratedColumn({ name: 'casos_id', type: 'bigint' })
  casosId!: number

  @Column({ name: 'dptoav_id', type: 'varchar', length: 2 })
  dptoavId!: string

  @Column({ name: 'uni_abrev', type: 'varchar', length: 3 })
  uniAbrev!: string

  @Column({ name: 'dis_id', type: 'bigint' })
  disId!: number

  @Column({ name: 'id_grupo', type: 'int' })
  idGrupo!: number

  @Column({ name: 'nombrecaso', type: 'varchar', length: 30 })
  nombreCaso!: string

  @Column({ name: 'nrocasogiaef', type: 'varchar', length: 20 })
  nroCasoGiaef!: string

  @Column({ name: 'nrocaso', type: 'varchar', length: 20 })
  nroCaso!: string

  @Column({ name: 'nrocasofis', type: 'varchar', length: 20 })
  nroCasoFis!: string

  @Column({ name: 'cudifp', type: 'varchar', length: 20 })
  cudifp!: string

  @Column({ name: 'perddom', type: 'boolean' })
  perddom!: boolean

  @Column({ name: 'nrocasoperdom', type: 'varchar', length: 20 })
  nroCasoPerdom!: string

  @Column({ name: 'eta_inv', type: 'int' })
  idEtapa!: number

  @ManyToOne(() => EtapaLgi)
  @JoinColumn({
    name: 'eta_inv',
    referencedColumnName: 'etId',
  })
  etapaInvestigacion!: EtapaLgi | null

  @Column({ name: 'remitefiscal', type: 'varchar', length: 70 })
  remiteFiscal!: string

  @Column({ name: 'remitefecha', type: 'timestamp without time zone' })
  fechaRecepcionFiscalia!: Date

  @Column({ name: 'responsable_llenado', type: 'varchar', length: 70 })
  conformeA!: string

  @Column({ name: 'conformea', type: 'varchar', length: 70 })
  inicioCaso!: string

  @Column({ name: 'codigo_servicio', type: 'varchar', length: 70 })
  codigoServicio!: string

  @Column({ name: 'fechainicio', type: 'timestamptz' })
  fechaInicio!: Date

  @Column({ name: 'id_estado', type: 'int', nullable: true })
  idEstado!: number | null

  @Column({ name: 'dias_otorgados', type: 'int', nullable: true })
  diasOtorgados!: number | null

  @Column({ name: 'control_juridiccional', type: 'varchar' })
  controlJurisdiccional!: string

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

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
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

  @UpdateDateColumn({
    name: 'fecha_etapa_procesal',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaEtapaProcesal!: Date
}
