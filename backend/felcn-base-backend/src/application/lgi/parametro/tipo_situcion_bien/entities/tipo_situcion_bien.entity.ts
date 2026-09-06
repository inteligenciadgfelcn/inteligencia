import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tipo_situacion_legal_bien',
  schema: 'parametricas',
})
export class TipoSituacionLegalBien {
  @PrimaryGeneratedColumn({
    name: 'id_tipo_situacion_legal_bien',
  })
  etId: number;

  @Column({
    name: 'descripcion',
    type: 'varchar',
    length: 255,
  })
  descripcion: string;

  @Column({
    name: 'tabla',
    type: 'varchar',
    length: 255,
  })
  tabla: string;
}