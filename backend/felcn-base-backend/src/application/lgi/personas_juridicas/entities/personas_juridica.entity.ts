import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'empresas',
})
export class PersonasJuridica {
  @PrimaryGeneratedColumn({
    name: 'emp_id',
    type: 'bigint',
  })
  empId: string

  @Column({
    name: 'op_id',
    type: 'bigint',
  })
  opId: string

  @Column({
    name: 'nombre',
    type: 'varchar',
    length: 100,
  })
  nombre: string

  @Column({
    name: 'nit',
    type: 'varchar',
    length: 30,
  })
  nit: string

  @Column({
    name: 'matricula',
    type: 'varchar',
    length: 30,
  })
  matricula: string

  @Column({
    name: 'representante',
    type: 'varchar',
    length: 100,
  })
  representante: string

  @Column({
    name: 'obs',
    type: 'text',
    nullable: true,
  })
  observaciones?: string | null

  @Column({
    name: 'imagen',
    type: 'bytea',
    nullable: true,
    select: false,
  })
  imagen?: Buffer | null

  @Column({
    name: 'fechahoraing',
    type: 'timestamp',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'char',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'propietario_socio',
    type: 'varchar',
    nullable: true,
  })
  propietarioSocio?: string | null

  @Column({
    name: 'beneficiarios_finales',
    type: 'varchar',
    nullable: true,
  })
  beneficiariosFinales?: string | null

  @Column({
    name: 'capital_social',
    type: 'varchar',
    nullable: true,
  })
  capitalSocial?: string | null

  @Column({
    name: 'direccion',
    type: 'varchar',
    nullable: true,
  })
  direccion?: string | null

  @Column({
    name: 'latitud',
    type: 'varchar',
    nullable: true,
  })
  latitud?: string | null

  @Column({
    name: 'longitud',
    type: 'varchar',
    nullable: true,
  })
  longitud?: string | null

  @Column({
    name: 'id_tipo_vinculo',
    type: 'varchar',
    nullable: true,
  })
  idTipoVinculo?: string | null

  @Column({
    name: 'pericia',
    type: 'boolean',
    default: false,
  })
  pericia: boolean

  @Column({
    name: 'resultado',
    type: 'text',
    nullable: true,
  })
  resultado?: string | null

  @Column({
    name: 'documento',
    type: 'varchar',
    nullable: true,
  })
  documento?: string | null
}
