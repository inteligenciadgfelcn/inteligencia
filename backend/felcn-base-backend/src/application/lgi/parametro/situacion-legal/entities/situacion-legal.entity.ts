import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'situacionlegal',
  schema: 'parametricas',
})
export class SituacionLegalLgi {
  @PrimaryGeneratedColumn({
    name: 'sl_id',
  })
  slId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}