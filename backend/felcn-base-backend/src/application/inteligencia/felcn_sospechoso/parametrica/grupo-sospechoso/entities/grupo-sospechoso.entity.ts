import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DistritoSospechoso } from '../../distrito-sospechoso/entities/distrito-sospechoso.entity'

@Entity({ name: 'grupo' })
export class GrupoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_grupo',
    comment: 'Clave primaria del registro',
  })
  idGrupo!: number

  @ManyToOne(() => DistritoSospechoso, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_distrital',
  })
  distrital!: DistritoSospechoso

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Abreviatura del grupo',
  })
  abreviatura!: string

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción del grupo',
  })
  descripcion!: string
}
