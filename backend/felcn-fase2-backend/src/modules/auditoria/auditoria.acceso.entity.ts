import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({
  name: 'auditoria_accesos',
  schema: 'auditoria',
})
export class AuditoriaAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ruta: string;

  @Column()
  metodo: string;

  @Column({ nullable: true })
  id_usuario?: number;

  @Column({ nullable: true })
  nro_pase?: string;

  @Column({ nullable: true })
  ip?: string;

  @Column({ type: 'json', nullable: true })
  parametros: any;

  @CreateDateColumn()
  fecha: Date;
}