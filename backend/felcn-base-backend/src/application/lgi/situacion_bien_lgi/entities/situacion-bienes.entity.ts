import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'situacionbienes',
})
export class SituacionBien {
  @PrimaryGeneratedColumn({
    name: 'sitb_id',
    type: 'bigint',
  })
  sitbId: string

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: string

  @Column({
    name: 'fisreq',
    type: 'varchar',
    length: 300,
  })
  fiscalRequirente: string

  @Column({
    name: 'calb_id',
    type: 'bigint',
  })
  calbId: string

  @Column({
    name: 'fechaent',
    type: 'timestamp',
  })
  fechaEntrega: Date

  @Column({
    name: 'responsabler',
    type: 'varchar',
    length: 150,
  })
  responsableRecepcion: string

  @Column({
    name: 'institucion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  institucion?: string | null

  @Column({
    name: 'ubicacion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  ubicacion?: string | null

  @Column({
    name: 'fechahoraing',
    type: 'timestamp',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'char',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'id_tipo_documento',
    type: 'integer',
    nullable: true,
  })
  idTipoDocumento?: number | null

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    nullable: true,
  })
  numeroDocumento?: string | null
}