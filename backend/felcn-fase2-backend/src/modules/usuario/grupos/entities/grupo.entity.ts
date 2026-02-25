import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Asignacion } from 'src/modules/operaciones/asignaciones/entities/asignacione.entity';
import { Distrital } from '../../distritales/entities/distritale.entity';

@Entity({ name: 'grupo', schema: 'usuario' })
@Index('UQ_grupo_distrito_descripcion', ['distrital', 'descripcion'], {
  unique: true,
})
export class Grupo extends BaseStatusEntity {
  @ManyToOne(() => Distrital, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_distrital',
    referencedColumnName: 'id',
  })
  distrital: Distrital;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción del grupo',
  })
  descripcion: string;

  @OneToMany(() => Asignacion, (asignacion) => asignacion.grupo)
  asignaciones: Asignacion[];

  constructor(data?: Partial<Grupo>) {
    super(data);
  }
}
