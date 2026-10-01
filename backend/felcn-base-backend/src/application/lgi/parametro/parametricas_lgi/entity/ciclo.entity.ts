import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity({ schema: 'parametricas', name: 'ciclo' })
export class CicloLgi {
  @PrimaryColumn({ name: 'id_ciclo', type: 'bigint' })
  id: string

  @Column({ name: 'descripcion', type: 'varchar' })
  descripcion: string
}