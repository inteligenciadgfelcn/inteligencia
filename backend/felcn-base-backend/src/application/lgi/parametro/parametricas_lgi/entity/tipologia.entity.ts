import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ schema: 'parametricas', name: 'tipologia' })
export class TipologiaLgi {
  @PrimaryColumn({ name: 'id_tipologia', type: 'bigint' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar' })
  descripcion: string
}