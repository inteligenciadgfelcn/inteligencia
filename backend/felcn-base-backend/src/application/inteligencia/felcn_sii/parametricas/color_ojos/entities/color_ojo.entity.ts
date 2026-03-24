import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
@Entity({ name: 'color_ojos', schema: 'parametricas' })
export class ColorOjo {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_color_ojos',
    comment: 'Clave primaria del registro',
  })
  idColorOjo: number

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de los ojos',
  })
  descripcion: string
}
