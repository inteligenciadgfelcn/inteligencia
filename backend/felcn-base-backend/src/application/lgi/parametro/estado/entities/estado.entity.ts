import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'estado',
  schema: 'public',
})
export class EstadoLgi {
  @PrimaryGeneratedColumn({
    name: 'est_id',
  })
  estId: number;

  @Column({
    name: 'et_id',
    type: 'integer',
  })
  etId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}