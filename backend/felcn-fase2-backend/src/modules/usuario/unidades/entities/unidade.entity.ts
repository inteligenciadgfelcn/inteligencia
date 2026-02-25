import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Distrital } from '../../distritales/entities/distritale.entity';
import { Grupo } from '../../../usuario/grupos/entities/grupo.entity';
import { Asignacion } from 'src/modules/operaciones/asignaciones/entities/asignacione.entity';

@Entity({
  name: 'unidad',
  schema: 'usuario',
})
export class Unidad extends BaseStatusEntity {
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Código único de la unidad',
  })
  codigo: string;

  @Column({
    name: 'codigo_icia',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Código ICIA de la unidad',
  })
  codigoIcia: string;

  @Column({
    name: 'abreviatura_rep',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Abreviatura para reportes',
  })
  abreviaturaRep: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Descripción de la unidad',
  })
  descripcion: string;

  @Column({
    name: 'op_adm',
    type: 'boolean',
    default: false,
    comment: 'Indicador de operación administrativa',
  })
  opAdm: boolean;

  @OneToMany(() => Distrital, (distrital) => distrital.unidad)
  distritales: Distrital[];

  constructor(data?: Partial<Unidad>) {
    super(data);
  }
}
