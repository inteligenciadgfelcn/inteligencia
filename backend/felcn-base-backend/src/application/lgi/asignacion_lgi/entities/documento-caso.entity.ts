import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ schema: 'public', name: 'documentacioncaso' })
export class DocumentacionCaso {
  @PrimaryGeneratedColumn({
    name: 'doc_caso_id',
    type: 'bigint',
  })
  docCasoId!: number

  @Column({ name: 'casos_id', type: 'bigint' })
  casosId!: number

  @Column({ name: 'descripcion', type: 'varchar' })
  descripcion!: string
}