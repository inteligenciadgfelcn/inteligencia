import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({
  schema: 'parametricas',
  name: 'tipodoc',
})
export class TipoDocumentoLgi {
  @PrimaryColumn({
    name: 'td_id',
    type: 'integer',
  })
  tdId: number

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}