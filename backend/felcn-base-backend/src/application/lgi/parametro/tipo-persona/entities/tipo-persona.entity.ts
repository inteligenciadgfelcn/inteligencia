import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tipopersona',
  schema: 'public',
})
export class TipoPersonaLgi {
  @PrimaryGeneratedColumn({
    name: 'tp_id',
  })
  tpId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;
}