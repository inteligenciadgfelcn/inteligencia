import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity({ name: 'color_piel', schema: 'parametricas' })
export class ColorPiel {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_color_piel',
    comment: 'Clave primaria del registro',
  })
  idColorPiel: number

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de piel',
  })
  descripcion: string
}
