import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Grado } from '../../grado/entities/grado.entity'
import { Grupo } from '../../grupo/entities/grupo.entity'
import { Estado } from '@/application/felcn_siii/estado.enum'

@Entity({ name: 'usuario', schema: 'public' })
export class Usuario {
  @PrimaryColumn({
    type: 'varchar',
    length: 15,
    name: 'usuario',
    comment: 'numero de pase de usuario',
  })
  usuario: string

  @ManyToOne(() => Grado, (grado) => grado.usuarios, { eager: false })
  @JoinColumn({
    name: 'id_grado',
  })
  grado: Grado

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    name: 'nombre_app',
    comment: 'Nombres completo del usuario',
  })
  nombres: string

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    name: 'telefono_celular',
    comment: 'Teléfono de celular del usuario',
  })
  telefono: string

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    name: 'telefono_fijo',
    comment: 'Teléfono fijo corporativo del usuario',
  })
  telefonoFijo: string

  @ManyToOne(() => Grupo, (grupo) => grupo.usuarios, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({
    name: 'id_grupo',
  })
  grupo: Grupo

  @Column({
    type: 'varchar',
    length: 1,
    nullable: true,
    name: 'rol',
    comment: 'Rol del usuario',
  })
  rol: string

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
