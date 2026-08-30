import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'recursos',
  schema: 'public',
})
export class RecursosLgi {
  @PrimaryGeneratedColumn({
    name: 'rec_id',
  })
  recId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}