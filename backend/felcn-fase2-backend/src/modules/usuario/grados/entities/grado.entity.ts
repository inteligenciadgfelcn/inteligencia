import { Column, Entity, Index } from 'typeorm';
import { BaseStatusEntity } from 'src/common/entity/base-status.entity';

@Entity({
  name: 'grado',
  schema: 'usuario',
})
export class Grado extends BaseStatusEntity {
  
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Abreviatura única del grado',
  })
  abreviatura: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción o nombre completo del grado',
  })
  descripcion: string;

  constructor(data?: Partial<Grado>) {
    super(data);
  }
}