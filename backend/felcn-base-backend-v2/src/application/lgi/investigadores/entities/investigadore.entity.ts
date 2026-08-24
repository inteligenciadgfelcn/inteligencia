import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
} from 'typeorm'
import { EstadoInvestigador } from '../enum/estado-investigador.enum'

@Entity({
  schema: 'public',
  name: 'investigador',
})
export class InvestigadorLgi {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'inv_id',
  })
  investigadorId!: number

  @Column({
    type: 'bigint',
    name: 'casos_id',
  })
  casoId!: number

  @Column({
    type: 'varchar',
    name: 'usuario_asignado',
    length: 15,
  })
  numeroPase!: string

  @Column({
    type: 'varchar',
    name: 'memo',
    length: 15,
  })
  memo!: string

  @Column({
    type: 'timestamptz',
    name: 'fechaasignacion',
  })
  fechaAsignacion!: Date

  @Column({
    type: 'boolean',
    name: 'actual',
    default: true,
  })
  actual!: boolean

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
    length: 15,
  })
  usuario!: string

  @Column({
    type: 'enum',
    enum: EstadoInvestigador,
    enumName: 'investigador_estado_enum',
    name: 'estado_investigador',
    default: EstadoInvestigador.ASIGNADO,
  })
  estadoInvestigador!: EstadoInvestigador

  @Column({
    type: 'timestamptz',
    name: 'fecha_separacion',
    nullable: true,
  })
  fechaSeparacion!: Date | null

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
