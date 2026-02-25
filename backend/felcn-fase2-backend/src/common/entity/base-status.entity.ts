import {
  Column,
  BeforeInsert,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Estado } from '../enums/estado.enum';

export abstract class BaseStatusEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
    comment: 'Estado del registro',
  })
  estado: Estado;

  @BeforeInsert()
  setEstadoPorDefecto() {
    if (!this.estado) {
      this.estado = Estado.ACTIVO;
    }
  }

  constructor(data?: Partial<BaseStatusEntity>) {
    super(data);
  }
}
