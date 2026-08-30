import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { SCHEMA_PARAMETRICAS } from '../../../../shared/constants'

@Entity({ name: 'tamanio_documento', schema: SCHEMA_PARAMETRICAS })
export class TamanioDocumento {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id_tamanio_documento' })
  id: number

  @Column({ name: 'descripcion', type: 'varchar', length: 30 })
  descripcion: string

  @Column({ name: 'ancho', type: 'integer' })
  ancho: number

  @Column({ name: 'alto', type: 'integer' })
  alto: number
}
