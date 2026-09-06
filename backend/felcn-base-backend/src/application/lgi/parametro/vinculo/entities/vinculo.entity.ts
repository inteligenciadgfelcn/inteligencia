import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
  name: 'vinculo',
  schema: 'parametricas',
})
export class VinculoLgi {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_vinculo',
  })
  idVinculo: number

  @Column()
  descripcion: string
}
