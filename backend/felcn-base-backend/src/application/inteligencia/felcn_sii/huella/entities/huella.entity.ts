import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'huellas', schema: 'public' })
export class Huella {
  @PrimaryGeneratedColumn({
    name: 'id_huella',
    type: 'int',
  })
  id: number

  @Column({
    name: 'id_persona',
    type: 'int',
  })
  idPersona: number

  @Column({
    name: 'dedo',
    type: 'varchar',
    length: 20,
  })
  dedo: string

  @Column({
    name: 'ruta_archivo',
    type: 'varchar',
    length: 255,
  })
  rutaArchivo: string

  @Column({
    name: 'calidad',
    type: 'int',
  })
  calidad: number

  @Column({
    name: 'fecha',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date
}
