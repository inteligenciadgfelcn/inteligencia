import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'bienes',
  schema: 'parametricas',
})
export class BienesLgi {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'bien_id',
  })
  bienId: number

  @Column()
  descripcion: string
}
