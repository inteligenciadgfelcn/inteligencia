import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'sentencia',
  schema: 'parametricas',
})
export class Sentencia {
  @PrimaryGeneratedColumn({
    name: 'id_sentencia',
    type: 'integer',
  })
  idSentencia: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}