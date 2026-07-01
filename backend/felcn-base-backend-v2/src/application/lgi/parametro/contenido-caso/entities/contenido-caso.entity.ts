import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'contenidocaso',
  schema: 'public',
})
export class ContenidoCasoLgi {
  @PrimaryGeneratedColumn({
    name: 'contcaso_id',
  })
  contcasoId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}