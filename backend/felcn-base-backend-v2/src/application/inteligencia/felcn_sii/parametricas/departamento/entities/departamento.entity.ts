import { Estado } from '@/application/inteligencia/felcn_siii/estado.enum'
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Pais } from '@/application/inteligencia/felcn_sii/parametricas/pais/entities/pais.entity'

@Entity({
  name: 'departamento',
  schema: 'parametricas',
})
export class Departamento {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_departamento',
    comment: 'Clave primaria del registro',
  })
  idDepartamento!: number

  @Index({ unique: true })
  @Column({
    name :'abreviatura',
    type: 'varchar',
    length: 2,
    nullable: false,
    comment: 'Abreviatura del departamento',
  })
  abreviatura!: string


  @Index(['pais'], { unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  descripcion!: string

  @ManyToOne(() => Pais, (pais) => pais.departamentos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_pais',
  })
  pais!: Pais

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
    comment: 'Estado del registro',
  })
  estado!: Estado

  @BeforeInsert()
  setEstadoPorDefecto() {
    if (!this.estado) {
      this.estado = Estado.ACTIVO
    }
  }

}
