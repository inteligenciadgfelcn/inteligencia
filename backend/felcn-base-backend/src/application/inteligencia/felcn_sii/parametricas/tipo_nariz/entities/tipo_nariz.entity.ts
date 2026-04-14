import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ schema: 'parametricas', name: 'tipo_nariz' })
export class TipoNariz {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_tipo_nariz',
    comment: 'Clave primaria del registro',
  })
  idTipoNariz: number

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    comment: 'Descripción de tipo de nariz',
  })
  descripcion: string
}
