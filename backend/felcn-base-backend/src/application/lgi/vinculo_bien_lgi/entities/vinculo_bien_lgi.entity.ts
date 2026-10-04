import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'vinculo_bien',
  schema: 'public',
})
export class VinculoBienLgi {
    @PrimaryGeneratedColumn({
    name: 'id_vinculo_bien',
    type: 'bigint',
  })
  idVinculoBien: string

  @Column({
    name: 'id_detenido_auxiliar',
    type: 'integer',
    nullable: true,
  })
  idDetenidoAuxiliar: number | null

  @Column({
    name: 'id_vinculo',
    type: 'integer',
    nullable: true,
  })
  idVinculo: number | null

  @Column({
    name: 'id_tipo_vinculo',
    type: 'integer',
    nullable: true,
  })
  idTipoVinculo: number | null

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
    nullable: true,
  })
  fechaHoraIngreso: Date | null

  @Column({
    name: 'usuario',
    type: 'varchar',
    nullable: true,
  })
  usuario: string | null

  @Column({
    name: 'estado',
    type: 'varchar',
    default: 'ACTIVO',
    nullable: true,
  })
  estado: string | null

  @Column({
    name: 'fecha_hora_actualizacion',
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
    name: 'id_item_bien_secuestrado',
    type: 'bigint',
    nullable: true,
  })
  idItemBienSecuestrado: string | null
}
