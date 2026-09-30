import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  schema: 'parametricas',
  name: 'tipoimplicado',
})
export class TipoImplicado {
  @PrimaryGeneratedColumn({
    name: 'id_tipo_implicado',
    type: 'bigint',
  })
  idTipoImplicado: string

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}
