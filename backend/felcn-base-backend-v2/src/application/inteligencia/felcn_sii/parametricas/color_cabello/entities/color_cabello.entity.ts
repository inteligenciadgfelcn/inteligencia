import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'color_cabello', schema: 'parametricas' })
export class ColorCabello {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_color_cabello',
    comment: 'Clave primaria del registro',
  })
  idColorCabello: number

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de la cabello',
  })
  descripcion: string
}
