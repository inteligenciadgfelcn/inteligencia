import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'medida_cautelar',
  schema: 'parametricas',
})
export class MedidaCautelar {
  @PrimaryGeneratedColumn({
    name: 'id_medida_cautelar',
    type: 'integer',
  })
  idMedidaCautelar: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}