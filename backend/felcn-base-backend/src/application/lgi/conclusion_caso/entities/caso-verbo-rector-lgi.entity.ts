import {
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity({ schema: 'public', name: 'caso_verbo_rector' })
@Unique('uq_caso_verbo_rector', ['casoId', 'verboRectorId'])
@Check('chk_caso_verbo_estado', `"estado" IN ('ACTIVO', 'INACTIVO')`)
export class CasoVerboRectorLgi {
  @PrimaryGeneratedColumn('identity', {
    name: 'id_caso_verbo_rector',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    primaryKeyConstraintName: 'pk_caso_verbo_rector',
  })
  id: string

  @Column({ name: 'casos_id', type: 'bigint' })
  casoId: string

  @Column({ name: 'id_verbo_rector', type: 'bigint' })
  verboRectorId: string

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