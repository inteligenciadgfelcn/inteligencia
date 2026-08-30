import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm'

@Entity({ schema: 'public', name: 'tipo_documento' })
export class TipoDocumentoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_tipo_documento',
    comment: 'Clave primaria del registro',
  })
  idTipoDocumento!: number

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Descripción oficial del tipo documento',
  })
  descripcion!: string

}
