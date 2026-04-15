import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'operativo', schema: 'public' })
export class Operativo {
  @PrimaryGeneratedColumn({
    name: 'id_operativo',
    type: 'int',
  })
  idOperativo!: number

  @Column({
    name: 'numero_caso',
    type: 'varchar',
    nullable: false,
  })
  numeroCaso!: string

  @Column({
    name: 'numero_operativo',
    type: 'varchar',
    nullable: true,
  })
  numeroOperativo!: string

  @Column({
    name: 'fecha_operativo',
    type: 'timestamp',
    nullable: true,
  })
  fechaOperativo!: Date

  @Column({
    name: 'id_departamento',
    type: 'int',
  })
  idDepartamento!: number

  @Column({
    name: 'id_provincia',
    type: 'int',
  })
  idProvincia!: number

  @Column({
    name: 'id_localidad',
    type: 'int',
  })
  idLocalidad!: number

  @Column({
    name: 'lugar',
    type: 'varchar',
    nullable: true,
  })
  lugar!: string

  @Column({
    name: 'id_categoria_operativo',
    type: 'int',
  })
  idCategoriaOperativo!: number

  @Column({
    name: 'id_item_operativo',
    type: 'int',
  })
  idItemOperativo!: number

  @Column({
    name: 'id_unidad',
    type: 'int',
  })
  idUnidad!: number

  @Column({
    name: 'id_distrital',
    type: 'int',
  })
  idDistrital!: number

  @Column({
    name: 'id_grupo',
    type: 'int',
  })
  idGrupo!: number

  @Column({
    name: 'mando',
    type: 'varchar',
    nullable: true,
  })
  mando!: string

  @Column({
    name: 'descripcion',
    type: 'varchar',
    nullable: true,
  })
  descripcion!: string

  @Column({
    name: 'revisado',
    type: 'boolean',
    default: false,
  })
  revisado!: boolean

  @Column({
    name: 'actualizacion',
    type: 'varchar',
    nullable: true,
  })
  actualizacion!: string

  @Column({
    name: 'fecha_creacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaCreacion!: Date

  @Column({
    name: 'usuario_creacion',
    type: 'varchar',
    nullable: true,
  })
  usuarioCreacion!: string

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaActualizacion!: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    nullable: true,
  })
  usuarioActualizacion!: string

}