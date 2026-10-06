import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  schema: 'public',
  name: 'implicados',
})
export class ImplicadoLgi {
  @PrimaryGeneratedColumn({
    name: 'imp_id',
    type: 'bigint',
  })
  id: string

  @Column({ name: 'op_id', type: 'bigint' })
  operativoId: string

  @Column({ name: 'id_tipo_implicado', type: 'bigint' })
  tipoImplicadoId: string

  @Column({ name: 'de_nombres', type: 'varchar', length: 50 })
  nombres: string

  @Column({ name: 'de_paterno', type: 'varchar', length: 50 })
  apellidoPaterno: string

  @Column({ name: 'de_materno', type: 'varchar', length: 50 })
  apellidoMaterno: string

  @Column({ name: 'de_esposo', type: 'varchar', length: 50 })
  apellidoEsposo: string

  @Column({ name: 'tipo_documento', type: 'bigint' })
  tipoDocumentoId: string

  @Column({ name: 'nrodoc', type: 'varchar', length: 15 })
  numeroDocumento: string

  @Column({ name: 'fechahoraing', type: 'timestamp' })
  fechaHoraIngreso: Date

  @Column({ name: 'usuario', type: 'varchar', length: 15 })
  usuario: string

  @Column({
    name: 'id_empresa',
    type: 'integer',
    nullable: true,
  })
  empresaId: number | null

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaHoraActualizacion: Date | null

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    nullable: true,
  })
  usuarioActualizacion: string | null

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 10,
    default: 'ACTIVO',
  })
  estado: string
}
