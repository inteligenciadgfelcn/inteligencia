import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'bienesincautados',
})
export class BienIncautado {
  @PrimaryGeneratedColumn({
    name: 'binc_id',
    type: 'numeric',
  })
  bincId: number

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: number

  @Column({
    name: 'nroresol',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  nroResol?: string | null

  @Column({
    name: 'fechares',
    type: 'timestamptz',
  })
  fechaResolucion: Date

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
