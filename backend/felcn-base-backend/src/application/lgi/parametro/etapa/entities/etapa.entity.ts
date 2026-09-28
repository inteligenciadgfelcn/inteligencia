import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'etapainvest',
  schema: 'parametricas',
})
export class EtapaLgi {
  @PrimaryGeneratedColumn({
    name: 'eta_inv',
  })
  etId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;

  @Column({ name: 'lgi', type: 'boolean' })
  lgi: boolean
  
}