import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'etapainvest',
  schema: 'parametricas',
})
export class EtapaLgi {
  @PrimaryGeneratedColumn({
    name: 'et_id',
  })
  etId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
  
}