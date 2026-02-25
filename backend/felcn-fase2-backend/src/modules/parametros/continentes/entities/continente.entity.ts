
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Pais } from '../../paises/entities/paise.entity';
import { BaseStatusEntity } from '../../../../common/entity/base-status.entity'

@Entity({
  name: 'continente',
  schema: 'parametricas',
})
export class Continente extends BaseStatusEntity {
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Código único del continente',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre oficial del continente',
  })
  nombre: string;

  @OneToMany(() => Pais, (pais) => pais.continente)
  paises: Pais[];

  constructor(data?: Partial<Continente>) {
    super(data);
  }
}
