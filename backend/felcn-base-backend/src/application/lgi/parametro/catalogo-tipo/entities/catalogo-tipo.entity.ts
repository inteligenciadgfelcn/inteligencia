import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'catalogotipo',
  schema: 'parametricas',
})
export class CatalogoTipoLgi {
  @PrimaryGeneratedColumn({
    name: 'cattipo_id',
  })
  cattipoId: number;

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