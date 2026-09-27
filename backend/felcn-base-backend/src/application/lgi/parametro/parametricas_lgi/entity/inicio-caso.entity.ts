import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({
  name: 'inicio_caso',
  schema: 'parametricas',
})
export class InicioCaso {
  @PrimaryGeneratedColumn({
    name: 'id_inicio_caso',
  })
  idInicioCaso!: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion!: string
}
