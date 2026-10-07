import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity({
  name: 'caso_bien_sujeto_pd',
  schema: 'public',
})
@Unique('uq_caso_bien_sujeto_pd', ['casosId', 'idBienSujetoPd'])
export class CasoBienSujetoPd {
  @PrimaryGeneratedColumn({
    name: 'id_caso_bien_sujeto_pd',
    type: 'integer',
  })
  idCasoBienSujetoPd: number

  @Column({
    name: 'casos_id',
    type: 'integer',
  })
  casosId: number

  @Column({
    name: 'id_bien_sujeto_pd',
    type: 'integer',
  })
  idBienSujetoPd: number

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 100,
  })
  usuario: string

  @Column({
    name: 'fechahoraing',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechahoraing: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usuarioActualizacion: string | null

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaActualizacion: Date | null
}