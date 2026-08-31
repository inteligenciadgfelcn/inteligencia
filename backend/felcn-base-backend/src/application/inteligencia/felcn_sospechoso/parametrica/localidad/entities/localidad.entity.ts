import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Provincia } from '../../provincia/entities/provincia.entity'

@Entity({ name: 'localidad' })
export class Localidad {
  @PrimaryGeneratedColumn({ name: 'id_localidad' })
  idLocalidad!: number

  @Column({ name: 'id_provincia' })
  idProvincia!: number

  @Column({ length: 150 })
  descripcion!: string

  @ManyToOne(() => Provincia, (prov) => prov.localidades)
  @JoinColumn({ name: 'id_provincia' })
  provincia!: Provincia
}
