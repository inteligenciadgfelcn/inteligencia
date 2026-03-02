import { BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { Estado } from '../../estado.enum'

@Entity({ name: 'grado' })
export class Grado {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_grado',
    comment: 'Clave primaria del registro',
  })
  idGrado: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    comment: 'Abreviatura única del grado',
  })
  abreviatura: string

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción o nombre completo del grado',
  })
  descripcion: string

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
    comment: 'Estado del registro',
  })
  estado: Estado

  @BeforeInsert()
  setEstadoPorDefecto() {
    if (!this.estado) {
      this.estado = Estado.ACTIVO
    }
  }
}
