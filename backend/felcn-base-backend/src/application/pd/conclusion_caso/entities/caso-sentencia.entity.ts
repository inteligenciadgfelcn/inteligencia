import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity({
  name: 'caso_sentencia',
  schema: 'public',
})
@Unique('uq_caso_sentencia', ['casosId', 'idSentencia'])
export class CasoSentencia {
  @PrimaryGeneratedColumn({
    name: 'id_caso_sentencia',
    type: 'integer',
  })
  idCasoSentencia: number

  @Column({
    name: 'casos_id',
    type: 'integer',
  })
  casosId: number

  @Column({
    name: 'id_sentencia',
    type: 'integer',
  })
  idSentencia: number

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