import {
  Check,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity({ schema: 'public', name: 'caso_tipologia' })
@Unique('uq_caso_tipologia', ['casoId', 'tipologiaId'])
@Check('chk_caso_tipologia_estado', `"estado" IN ('ACTIVO', 'INACTIVO')`)
export class CasoTipologiaLgi {
  @PrimaryGeneratedColumn('identity', {
    name: 'id_caso_tipologia',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    primaryKeyConstraintName: 'pk_caso_tipologia',
  })
  id: string

  @Column({ name: 'casos_id', type: 'bigint' })
  casoId: string

  @Column({ name: 'id_tipologia', type: 'bigint' })
  tipologiaId: string

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