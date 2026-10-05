import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  schema: 'public',
  name: 'perdidadominio',
})
export class SituacionJuridicaPd {
  @PrimaryGeneratedColumn({
    name: 'perdom_id',
    type: 'bigint',
  })
  perdomId: string

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itemBienSecId: string

  @Column({
    name: 'fiscalia',
    type: 'varchar',
    length: 100,
  })
  fiscalia: string

  @Column({
    name: 'fechares',
    type: 'timestamptz',
  })
  fechaResolucion: Date

  @Column({
    name: 'autoridad',
    type: 'varchar',
    length: 300,
  })
  autoridad: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'char',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'id_medida_cautelar',
    type: 'integer',
    nullable: true,
  })
  idMedidaCautelar: number | null
  
}