import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'catalogojuridica',
  schema: 'public',
})
export class CatalogoJuridicaLgi {
  @PrimaryGeneratedColumn({
    name: 'catjur_id',
  })
  catjurId: number;

  @Column({
    name: 'catclas_id',
    type: 'integer',
  })
  catclasId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}