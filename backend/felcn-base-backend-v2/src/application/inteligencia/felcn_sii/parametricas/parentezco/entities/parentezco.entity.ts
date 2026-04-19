import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm'
import { DatosFamiliares } from '../../../datos_familiares/entities/datos_familiare.entity'

@Entity({
  name: 'parentezco',
  schema: 'parametricas',
})
export class Parentezco {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_parentezco',
    comment: 'Clave primaria del registro',
  })
  idParentezco: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción de parentezco',
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
  
  @OneToMany(() => DatosFamiliares, (df) => df.parentezco)
  datosFamiliares: DatosFamiliares[]
}
