import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Asignacion } from 'src/modules/operaciones/asignaciones/entities/asignacione.entity';

@Entity({
  name: 'letra',
  schema: 'parametricas',
})
@Index('UQ_letra_descripcion', ['descripcion'], { unique: true })
export class Letra extends BaseStatusEntity {

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Letra identificadora utilizada para la generación del número de caso',
  })
  descripcion: string;

  @OneToMany(() => Asignacion, (asignacion) => asignacion.letras)
  asignaciones: Asignacion[];

  constructor(data?: Partial<Letra>) {
    super(data);
  }
}