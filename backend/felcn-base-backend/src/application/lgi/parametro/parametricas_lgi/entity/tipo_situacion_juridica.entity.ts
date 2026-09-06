import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
    schema: 'parametricas',
  name: 'tipo_situacion_juridica',
})
export class TipoSituacionJuridica {
  @PrimaryGeneratedColumn({
    name:
      'id_tipo_situacion_juridica',
    type: 'bigint',
  })
  idTipoSituacionJuridica: string

  @Column({
    name: 'descripcion',
    type: 'varchar',
  })
  descripcion: string
}