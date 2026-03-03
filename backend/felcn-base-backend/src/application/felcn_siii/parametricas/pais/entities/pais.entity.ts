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
import { Continente } from '../../continente/entities/continente.entity'
import { Departamento } from '../../departamento/entities/departamento.entity'

@Entity({
  name: 'pais',
  schema: 'parametricas',
})
export class Pais {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_pais',
    comment: 'Clave primaria del registro',
  })
  idPais: number

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Nombre oficial del país',
  })
  descripcion: string

  @ManyToOne(() => Continente, (continente) => continente.paises, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_continente' })
  continente: Continente

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

  @OneToMany(() => Departamento, (departamento) => departamento.pais)
  departamentos: Departamento[]
}
