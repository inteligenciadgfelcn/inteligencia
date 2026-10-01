import {
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity({ schema: 'public', name: 'caso_ciclo' })
@Unique('uq_caso_ciclo', ['casoId', 'cicloId'])
@Check('chk_caso_ciclo_estado', `"estado" IN ('ACTIVO', 'INACTIVO')`)
export class CasoCicloLgi {
  @PrimaryGeneratedColumn('identity', {
    name: 'id_caso_ciclo',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    primaryKeyConstraintName: 'pk_caso_ciclo',
  })
  id: string

  @Column({ name: 'casos_id', type: 'bigint' })
  casoId: string

  @Column({ name: 'id_ciclo', type: 'bigint' })
  cicloId: string

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  usuarioActualizacion: string | null

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaHoraActualizacion: Date | null
}