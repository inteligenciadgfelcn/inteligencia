import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm"
import { DistritoSospechoso } from "../../distrito-sospechoso/entities/distrito-sospechoso.entity"

@Entity({ name: 'unidad' })
export class UnidadSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_unidad',
    comment: 'Clave primaria del registro',
  })
  idUnidad!: number

   @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
    comment: 'Abreviatura de la unidad',
  })
  abreviatura!: string

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de la unidad',
  })
  descripcion!: string

  @OneToMany(() => DistritoSospechoso, (distrito) => distrito.unidad)
  distritos!: DistritoSospechoso[]
}
