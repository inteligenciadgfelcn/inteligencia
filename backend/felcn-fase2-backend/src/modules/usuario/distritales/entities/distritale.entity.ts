import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Unidad } from '../../unidades/entities/unidade.entity';
import { Grupo } from '../../../usuario/grupos/entities/grupo.entity';

@Entity({
  name: 'distrital',
  schema: 'usuario',
})
export class Distrital extends BaseStatusEntity {
  @Index()
  @ManyToOne(() => Unidad, (unidad) => unidad.distritales, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_unidad',
    referencedColumnName: 'id',
  })
  unidad: Unidad;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Descripción única del distrital',
  })
  descripcion: string;

  @OneToMany(() => Grupo, (grupo) => grupo.distrital)
  grupos: Grupo[];

  constructor(data?: Partial<Distrital>) {
    super(data);
  }
}
