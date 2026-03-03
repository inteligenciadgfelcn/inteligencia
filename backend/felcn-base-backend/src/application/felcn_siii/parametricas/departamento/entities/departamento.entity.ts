import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Estado } from '@/application/felcn_s2i/estado.enum'
import { Pais } from '../../pais/entities/pais.entity'
import { Asignacion } from '@/application/felcn_siii/operaciones/asignaciones/entities/asignacione.entity'

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
  idDepartamento: number

  @Index({ unique: true })
  @Column({
    name :'abreviatura',
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  abreviatura: string


  @Index(['pais'], { unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre del departamento',
  })
  descripcion: string

  @ManyToOne(() => Pais, (pais) => pais.departamentos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'id_pais',
  })
  pais: Pais

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

  // @OneToMany(() => Provincia, (provincia) => provincia.departamento)
  // provincias: Provincia[];

  @OneToMany(() => Asignacion, (asignacion) => asignacion.departamento)
  asignaciones: Asignacion[]
}
