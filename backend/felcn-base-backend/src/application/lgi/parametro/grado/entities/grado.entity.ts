import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'grados',
  schema: 'public',
})
export class GradoLgi {
  @PrimaryGeneratedColumn({
    name: 'gr_id',
  })
  grId: number;

  @Column({
    name: 'abrev',
    type: 'varchar',
    length: 50,
  })
  abrev: string;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}