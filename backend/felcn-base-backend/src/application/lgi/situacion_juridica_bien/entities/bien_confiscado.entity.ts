import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'bienesconfiscados',
})
export class BienConfiscado {
  @PrimaryGeneratedColumn({
    name: 'bconf_id',
    type: 'numeric',
  })
  bconfId: number

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: number

  @Column({
    name: 'numsentjud',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numSentJud?: string | null

  @Column({
    name: 'fechasenjud',
    type: 'timestamptz',
  })
  fechaSenjud: Date

  @Column({
    name: 'autoridad',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  autoridad?: string | null

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
