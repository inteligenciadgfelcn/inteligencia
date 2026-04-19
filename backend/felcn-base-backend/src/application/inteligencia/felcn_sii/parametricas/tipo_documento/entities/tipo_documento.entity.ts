import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { DocumentoDetenido } from '../../../../felcn_sii/filiacion/documento_detenido/entities/documento_detenido.entity'

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

  @OneToMany(() => DocumentoDetenido, (doc) => doc.tipoDocumento)
  documentos: DocumentoDetenido[]
}
