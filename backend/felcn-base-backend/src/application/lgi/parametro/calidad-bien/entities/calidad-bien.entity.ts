import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'calidadbien',
  schema: 'parametricas',
})
export class CalidadBienLgi {
  @PrimaryGeneratedColumn({
    name: 'calb_id',
  })
  calbId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}