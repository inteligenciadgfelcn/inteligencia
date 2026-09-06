import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'bienessecuestados',
})
export class BienSecuestado {
  @PrimaryGeneratedColumn({
    name: 'bsec_id',
    type: 'numeric',
  })
  bsecId: number

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: number

  @Column({
    name: 'fiscal',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  fiscal?: string | null

  @Column({
    name: 'fechaactsec',
    type: 'timestamptz',
  })
  fechaActaSecuestro: Date

  @Column({
    name: 'investigador',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  investigador?: string | null

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
