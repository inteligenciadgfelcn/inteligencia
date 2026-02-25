import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity( { name: 'auditoria', schema: 'auditoria' })
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tabla: string;

  @Column({ nullable: true })
  registroId: number;

  @Column()
  accion: string;

  @Column({ type: 'json', nullable: true })
  datosAntes: any;

  @Column({ type: 'json', nullable: true })
  datosDespues: any;

  @Column({ nullable: true, name: 'id_usuario' })
  idUsuario: number;

  @Column({ nullable: true, name: 'nro_pase' })
  nroPase: string;

  @CreateDateColumn()
  fecha: Date;
}