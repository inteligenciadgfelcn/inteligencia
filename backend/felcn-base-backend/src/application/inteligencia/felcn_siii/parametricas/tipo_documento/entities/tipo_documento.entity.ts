import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ schema: 'parametricas', name: 'tipo_documento' })
export class TipoDocumento {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_tipo_documento',
    comment: 'Clave primaria del registro',
  })
  idTipoDocumento: number

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: 'Descripción oficial del tipo documento',
  })
  descripcion: string

}
