import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: 'bien_sujeto_pd',
  schema: 'parametricas',
})
export class BienSujetoPd {
  @PrimaryGeneratedColumn({
    name: 'id_bien_sujeto_pd',
    type: 'integer',
  })
  idBienSujetoPd: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}