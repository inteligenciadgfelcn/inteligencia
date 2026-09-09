import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'situacionbienes',
})
export class SituacionBien {
  @PrimaryGeneratedColumn({
    name: 'sitb_id',
    type: 'bigint',
  })
  sitbId: number

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: number

  @Column({
    name: 'fechareq',
    type: 'timestamptz',
  })
  fechaRequerimiento: Date

  @Column({
    name: 'fisreq',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  fiscalRequirente?: string | null

  @Column({
    name: 'calb_id',
    type: 'integer',
    nullable: true,
  })
  calbId?: number | null

  @Column({
    name: 'fechaent',
    type: 'timestamptz',
    nullable: true,
  })
  fechaEntrega?: Date | null

  @Column({
    name: 'responsablee',
    type: 'varchar',
    length: 150,
  })
  responsableEntrega: string

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
  })
  institucion: string

  @Column({
    name: 'ubicacion',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  ubicacion?: string | null

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
}
