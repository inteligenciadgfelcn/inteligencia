import { PrimaryGeneratedColumn, Column } from "typeorm";

export class InvestigadorLgi {

  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'inv_id',
  })
  investigadorId!: number;

  @Column({
    type: 'bigint',
    name: 'casos_id',
  })
  casoId!: number;

  @Column({
    type: 'char',
    name: 'usuario',
    length: 15,
  })
  numeroPase!: string;

  @Column({
    type: 'char',
    name: 'memo',
    length: 15,
  })
  memo!: string;

  @Column({
    type: 'timestamp',
    name: 'fechaasignacion',
  })
  fechaAsignacion!: Date;

  @Column({
    type: 'boolean',
    name: 'actual',
  })
  actual!: boolean;

  @Column({
    type: 'text',
    name: 'updinf',
  })
  informacionActualizada!: string;

  @Column({
    type: 'timestamp',
    name: 'fechahoraing',
  })
  fechaHoraIngreso!: Date;

  @Column({
    type: 'char',
    name: 'usuario',
    length: 15,
  })
  usuarioRegistro!: string;

}
