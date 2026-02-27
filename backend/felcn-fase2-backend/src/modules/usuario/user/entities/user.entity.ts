import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';

import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Grado } from '../../grados/entities/grado.entity';
import { Grupo } from '../../grupos/entities/grupo.entity';

@Entity({
  name: 'usuario',
  schema: 'usuario',
})
export class User extends BaseStatusEntity {
  @Index({ unique: true })
  @Column({
    type: 'int',
    nullable: false,
    name: 'id_usuario',
    comment: 'Id usuario de bd ciudadania',
  })
  idUsuario: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Nro de Carnet o pasaporte',
  })
  nroDocumento: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
    comment: 'Tipo de documento',
  })
  tipoDocumento: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Nombres del usuario',
  })
  nombres: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Primer apellido del usuario',
  })
  primerApellido: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Segundo apellido del usuario',
  })
  segundoApellido: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Correo electronico del usuario',
  })
  correoElectronico: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    name: 'nro_pase',
    length: 20,
    nullable: false,
    comment: 'Número de pase único del usuario',
  })
  nroPase: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono del usuario',
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono corporativo del usuario',
  })
  telefonoCorporativo: string;

  @ManyToOne(() => Grado, { eager: false })
  @JoinColumn({
    name: 'id_grado',
  })
  grado: Grado;

  @ManyToOne(() => Grupo, { eager: false })
  @JoinColumn({
    name: 'id_grupo',
  })
  grupo: Grupo;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
