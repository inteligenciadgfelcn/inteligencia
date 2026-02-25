import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Departamento } from '../../departamentos/entities/departamento.entity';
import { BaseStatusEntity } from '../../../../common/entity/base-status.entity';
import { Continente } from '../../continentes/entities/continente.entity';

@Entity({
  name: 'pais',
  schema: 'parametricas',
})
export class Pais extends BaseStatusEntity {
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Código único del país',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre oficial del país',
  })
  nombre: string;

  @ManyToOne(() => Continente, (continente) => continente.paises, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_continente' })
  continente: Continente;

  @OneToMany(() => Departamento, (departamento) => departamento.pais)
  departamentos: Departamento[];

  constructor(data?: Partial<Pais>) {
    super(data);
  }
}
