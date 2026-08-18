import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PersonasImplicada } from '../../personas_implicadas/entities/personas_implicada.entity'

@Entity({
  schema: 'public',
  name: 'situacion',
})
export class SituacionJuridica {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'sit_id',
  })
  situacionId!: number

  @Column({
    type: 'int',
    name: 'de_id',
  })
  detenidoId!: number

  @Column({
    type: 'int',
    name: 'sl_id',
  })
  situacionLegalId!: number

  @Column({
    type: 'varchar',
    name: 'nroresolucion',
    length: 50,
  })
  numeroResolucion!: string

  @Column({
    type: 'varchar',
    name: 'lugar',
    length: 100,
  })
  lugar!: string

  @Column({
    type: 'timestamp',
    name: 'fecha',
  })
  fecha!: Date

  @Column({
    type: 'varchar',
    name: 'autoridad',
    length: 150,
  })
  autoridad!: string

  @Column({
    type: 'varchar',
    name: 'fjt',
    length: 100,
  })
  fjt!: string

  @Column({
    type: 'text',
    name: 'updinf',
  })
  informacionActualizada!: string

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

  @Column({
    type: 'boolean',
    name: 'estado',
    default: true,
  })
  estado!: boolean

  @ManyToOne(
    () => PersonasImplicada,
    (persona) => persona.situacionesJuridicas,
    {
      nullable: false,
    }
  )
  @JoinColumn({
    name: 'de_id',
    referencedColumnName: 'deId',
  })
  personaImplicada!: PersonasImplicada
}
