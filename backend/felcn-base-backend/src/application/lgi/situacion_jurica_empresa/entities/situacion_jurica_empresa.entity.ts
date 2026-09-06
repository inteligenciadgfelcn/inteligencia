import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { PersonasJuridica } from '../../personas_juridicas/entities/personas_juridica.entity'
import { TipoSituacionJuridica } from '../../parametro/parametricas_lgi/entity/tipo_situacion_juridica.entity'

@Entity({
  name: 'situacion_juridica_empresa',
})
export class SituacionJuridicaEmpresa {
  @PrimaryGeneratedColumn({
    name: 'id_situacion_juridica_empresa',
    type: 'bigint',
  })
  idSituacionJuridicaEmpresa: string

  @Column({
    name: 'id_empresa',
    type: 'integer',
  })
  idEmpresa: number

  @Column({
    name: 'fecha',
    type: 'date',
  })
  fecha: string

  @Column({
    name: 'quien_autoriza',
    type: 'varchar',
  })
  quienAutoriza: string

  @Column({
    name: 'a_quien_entregan',
    type: 'varchar',
  })
  aQuienEntregan: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'id_tipo_situacion_juridica',
    type: 'integer',
  })
  idTipoSituacionJuridica: number

  @ManyToOne(() => PersonasJuridica, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'id_empresa',
    referencedColumnName: 'empId',
  })
  empresa: PersonasJuridica

  @ManyToOne(() => TipoSituacionJuridica, {
    nullable: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'id_tipo_situacion_juridica',
    referencedColumnName: 'idTipoSituacionJuridica',
  })
  tipoSituacionJuridica: TipoSituacionJuridica
}
