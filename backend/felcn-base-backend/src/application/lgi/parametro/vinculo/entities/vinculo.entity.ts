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
  bienId: number

  @Column()
  descripcion: string
}
