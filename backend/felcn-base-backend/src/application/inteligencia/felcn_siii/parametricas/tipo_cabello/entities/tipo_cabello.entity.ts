import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'tipo_cabellos', schema: 'parametricas' })
export class TipoCabello {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_tipo_cabello',
    comment: 'Clave primaria del registro',
  })
  idTipoCabello: number

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de tipo de cabello',
  })
  descripcion: string
}
