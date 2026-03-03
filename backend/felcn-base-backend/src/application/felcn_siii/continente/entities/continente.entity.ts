import { Estado } from '@/application/felcn_s2i/estado.enum'
import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Pais } from '../../pais/entities/pais.entity'

@Entity({
  name: 'continente',
  schema: 'parametricas',
})
export class Continente {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_continente',
    comment: 'Clave primaria del registro',
  })
  idContinente: number

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Descripción oficial del continente',
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

  //@OneToMany(() => Pais, (pais) => pais.continente)
 // paises: Pais[]
}
