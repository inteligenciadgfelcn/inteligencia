import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'catalogocaracteristicas',
  schema: 'parametricas',
})
export class CatalogoCaracteristicasLgi {
  @PrimaryGeneratedColumn({
    name: 'catcarac_id',
  })
  catcaracId: number;

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