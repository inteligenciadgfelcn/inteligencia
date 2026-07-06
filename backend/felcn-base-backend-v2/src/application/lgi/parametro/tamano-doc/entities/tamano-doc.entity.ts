import { AuditableEntity } from '@/common/entity/auditable.entity'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: 'tamanodoc',
  schema: 'public',
})
export class UnidadLgi{
  @PrimaryGeneratedColumn({
    name: 'tamdoc_id',
  })
  tamdocId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;

  @Column({
    name: 'ancho',
    type: 'integer',
  })
  ancho: number;

  @Column({
    name: 'alto',
    type: 'integer',
  })
  alto: number;
}