import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'

@Entity({
  name: 'fotobienes',
})
export class FotoBienLgi {
  @PrimaryGeneratedColumn({
    name: 'fotobien_id',
    type: 'bigint',
  })
  fotobienId: string

  @Column({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itembiensecId: string

  @Column({
    name: 'fotografia',
    type: 'bytea',
  })
  fotografia: Buffer

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 75,
  })
  descripcion: string

  @Column({
    name: 'estado',
    type: 'varchar',
    length: 15,
    default: 'ACTIVO',
  })
  estado: string

  @ManyToOne(() => BieneSecuestradoLgi, (bien) => bien.fotografias, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'itembiensec_id',
  })
  bienSecuestrado: BieneSecuestradoLgi
}
