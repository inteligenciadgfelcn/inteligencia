import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'operativo',
})
export class OperativoLgi {
  @PrimaryGeneratedColumn({
    name: 'op_id',
    type: 'bigint',
  })
  opId!: number

  @Column({
    name: 'casos_id',
    type: 'bigint',
  })
  casosId!: number

  @Column({
    name: 'op_nrooper',
    type: 'varchar',
    length: 20,
  })
  opNrooper!: string

  @Column({
    name: 'op_fechainf',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  opFechainf!: Date

  @Column({
    name: 'dpto_id',
    type: 'int',
  })
  dptoId!: number

  @Column({
    name: 'prov_id',
    type: 'int',
  })
  provId!: number

  @Column({
    name: 'loc_id',
    type: 'int',
  })
  locId!: number

  @Column({
    name: 'op_lugar',
    type: 'varchar',
    length: 255,
  })
  opLugar!: string

  @Column({
    name: 'uni_id',
    type: 'int',
  })
  uniId!: number

  @Column({
    name: 'dis_id',
    type: 'int',
  })
  disId!: number

  @Column({
    name: 'op_descripcion',
    type: 'text',
  })
  opDescripcion!: string

  @Column({
    name: 'id_etapa',
    type: 'int',
  })
  idEtapa!: number

  @Column({
    name: 'id_estado',
    type: 'int',
    nullable: true,
  })
  idEstado!: number | null

  @Column({
    name: 'dias_otorgados',
    type: 'int',
  })
  diasOtorgados!: number

  @Column({
    name: 'id_tipo_informe',
    type: 'int',
  })
  idTipoInforme!: number

  @Column({
    name: 'otro_informe',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  otroInforme!: string | null

  @Column({
    name: 'fecha_recepcion_fiscalia',
    type: 'timestamptz',
  })
  fechaRecepcionFiscalia!: Date

  @Column({
    name: 'ruta_archivo',
    type: 'varchar',
    length: 255,
  })
  rutaArchivo!: string

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
