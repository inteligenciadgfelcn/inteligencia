import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ schema: 'parametricas', name: 'verbo_rector' })
export class VerboRectorLgi {
  @PrimaryColumn({ name: 'id_verbo_rector', type: 'bigint' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar' })
  descripcion: string
}