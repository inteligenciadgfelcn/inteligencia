
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'tipo_vinculo',
  schema: 'parametricas',
})
export class TipoVinculoLgi {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id_tipo_vinculo',
  })
  idTipoVinculo: number
  
  @Column({
    type: 'bigint',
    name: 'id_vinculo',
  })
  idVinculo: number

  @Column()
  descripcion: string
  
}