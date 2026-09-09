import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'contenidobien',
  schema: 'public',
})
export class ContenidoBienLgi {
  @PrimaryGeneratedColumn({
    name: 'contbien_id',
  })
  contbienId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}