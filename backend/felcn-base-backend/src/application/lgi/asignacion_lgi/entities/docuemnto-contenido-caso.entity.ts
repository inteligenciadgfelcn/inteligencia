import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ schema: 'public', name: 'documcontenidocaso' })
export class DocumentoContenidoCaso {
  @PrimaryGeneratedColumn({
    name: 'documcaso_id',
    type: 'bigint',
  })
  documentoCasoId!: number

  @Column({ name: 'doc_caso_id', type: 'bigint' })
  docCasoId!: number

  @Column({ name: 'archivo', type: 'bytea' })
  archivo!: Buffer
}