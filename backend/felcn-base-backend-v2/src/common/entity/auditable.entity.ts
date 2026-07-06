import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AuditableEntity {
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'fecha_hora_ingreso',
  })
  fechaHoraIngreso?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'usuario',
    nullable: true,
  })
  usuario?: string;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'fecha_hora_actualizacion',
    nullable: true,
  })
  fechaHoraActualizacion?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'usuario_actualizacion',
    nullable: true,
  })
  usuarioActualizacion?: string;
}