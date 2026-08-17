import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { SituacionJuridica } from '../../situacion_juridica/entities/situacion_juridica.entity'

@Entity({
  schema: 'public',
  name: 'detenidosaux',
})
export class PersonasImplicada {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'de_id',
  })
  deId!: number

  @Column({
    type: 'int',
    name: 'caso_id',
  })
  casoId!: number

  @Column({
    type: 'varchar',
    name: 'de_nombres',
    length: 50,
  })
  nombres!: string

  @Column({
    type: 'varchar',
    name: 'de_paterno',
    length: 50,
  })
  paterno!: string

  @Column({
    type: 'varchar',
    name: 'de_materno',
    length: 50,
  })
  materno!: string

  @Column({
    type: 'varchar',
    name: 'de_esposo',
    length: 50,
  })
  esposo!: string

  @Column({
    type: 'int',
    name: 'pa_id',
  })
  paisId!: number

  @Column({
    type: 'int',
    name: 'ec_id',
  })
  estadoCivilId!: number

  @Column({
    type: 'int',
    name: 'prof_id',
  })
  profesionId!: number

  @Column({
    type: 'int',
    name: 'td_id',
  })
  tipoDocumentoId!: number

  @Column({
    type: 'varchar',
    name: 'nro_docum',
    length: 50,
  })
  numeroDocumento!: string

  @Column({
    type: 'varchar',
    name: 'relacion',
    length: 250,
  })
  relacion!: string

  @Column({
    type: 'text',
    name: 'observaciones',
  })
  observaciones!: string

  @Column({
    type: 'timestamptz',
    name: 'fechahoraing',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraIngreso!: Date

  @Column({
    type: 'varchar',
    name: 'usuario',
    length: 50,
  })
  usuario!: string

  @Column({
    type: 'varchar',
    name: 'usuario_actualizacion',
    length: 15,
  })
  usuarioActualizacion!: string

  @Column({
    type: 'timestamptz',
    name: 'fecha_actualizacion',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraActualizacion?: Date

  @OneToMany(
    () => SituacionJuridica,
    (situacion) => situacion.personaImplicada,
  )
  situacionesJuridicas!: SituacionJuridica[];
}
