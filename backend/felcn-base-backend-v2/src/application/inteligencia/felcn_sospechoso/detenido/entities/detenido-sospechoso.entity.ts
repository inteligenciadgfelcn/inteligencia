import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { EstadoSospechoso } from '../../parametrica/estado/entities/estadoSospechoso.entity'
import { TipoDocumentoSospechoso } from './tipo_documento-sospechoso.entity'
import { PaisSospechoso } from './pais-sospechoso.entity'

@Entity({ name: 'detenido', schema: 'public' })
export class DetenidoSospechoso {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id_detenido',
    comment: 'Clave primaria del detenido',
  })
  idDetenido!: number

  @Column({
    name: 'id_operativo',
    type: 'int',
    comment: 'Referencia al operativo',
  })
  idOperativo!: number

  @Column({
    name: 'apellido_paterno',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoPaterno!: string

  @Column({
    name: 'apellido_materno',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoMaterno!: string

  @Column({
    name: 'apellido_esposo',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  apellidoEsposo!: string

  @Column({
    name: 'nombres',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  nombres!: string

  @Column({
    name: 'id_pais',
    type: 'int',
    nullable: true,
  })
  idPais!: number

  @Column({
    name: 'genero',
    type: 'boolean',
    nullable: true,
    comment: 'true = masculino, false = femenino',
  })
  genero!: boolean

  @Column({
    name: 'direccion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  direccion!: string

  @Column({
    name: 'verificado',
    type: 'boolean',
  })
  verificado!: boolean

  @Column({
    name: 'id_tipo_documento',
    type: 'int',
    nullable: true,
  })
  idTipoDocumento!: number

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  numeroDocumento!: string

  @Column({
    name: 'id_estado',
    type: 'int',
    nullable: true,
  })
  idEstado!: number

  @Column({
    name: 'fecha_creacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaCreacion!: Date

  @Column({
    name: 'usuario_creacion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  usuarioCreacion!: string

  @ManyToOne(() => EstadoSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_estado' })
  estado!: EstadoSospechoso

  @ManyToOne(() => TipoDocumentoSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_tipo_documento' })
  tipoDocumento!: TipoDocumentoSospechoso

  @ManyToOne(() => PaisSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_pais' })
  pais!: PaisSospechoso
}
