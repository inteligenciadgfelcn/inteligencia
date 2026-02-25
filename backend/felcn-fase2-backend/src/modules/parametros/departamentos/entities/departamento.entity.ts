import {
  Column,
  Entity,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Pais } from '../../paises/entities/paise.entity';
import { Provincia } from '../../provincias/entities/provincia.entity';
import { BaseStatusEntity } from '../../../../common/entity/base-status.entity';
import { Asignacion } from 'src/modules/operaciones/asignaciones/entities/asignacione.entity';

@Entity({
  name: 'departamento',
  schema: 'parametricas',
})
export class Departamento extends BaseStatusEntity {
  @Index(['codigo', 'pais'], { unique: true })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    comment: 'Código del departamento',
  })
  codigo: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  nombre: string;

  @ManyToOne(() => Pais, (pais) => pais.departamentos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_pais',
    referencedColumnName: 'id',
  })
  pais: Pais;

  @OneToMany(() => Provincia, (provincia) => provincia.departamento)
  provincias: Provincia[];

  @OneToMany(() => Asignacion, (asignacion) => asignacion.departamento)
  asignaciones: Asignacion[];

  constructor(data?: Partial<Departamento>) {
    super(data);
  }
}
