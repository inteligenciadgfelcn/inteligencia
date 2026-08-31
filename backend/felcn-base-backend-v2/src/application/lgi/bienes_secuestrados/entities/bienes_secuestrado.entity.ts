import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { OperativoLgi } from '../../actuaciones/entities/operativoLgi.entity'
import { CatalogoClaseLgi } from '../../parametro/catalogo-clase/entities/catalogo-clase.entity'
import { TipoVinculoLgi } from '../../parametro/tipo-vinculo/entities/tipo-vinculo.entity'
import { CatalogoTipoLgi } from '../../parametro/catalogo-tipo/entities/catalogo-tipo.entity'

@Entity({
  name: 'itembiensecuestrado',
})
export class BieneSecuestradoLgi {
  @PrimaryGeneratedColumn({
    name: 'itembiensec_id',
    type: 'bigint',
  })
  itembiensecId: string

  @Column({
    name: 'op_id',
    type: 'int',
  })
  opId: number

  @Column({
    name: 'cattipo_id',
    type: 'int',
  })
  cattipoId: number

  @Column({
    name: 'cantidadbien',
    type: 'int',
    default: 1,
  })
  cantidadBien: number

  @Column({
    name: 'costoaprox',
    type: 'double precision',
  })
  costoAprox: number

  @Column({
    name: 'costocuant',
    type: 'double precision',
  })
  costoCuant: number

  @Column({
    name: 'inves',
    type: 'boolean',
    nullable: true,
  })
  inves: boolean

  @Column({
    name: 'fechahoraing',
    type: 'timestamp without time zone',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 15,
  })
  usuario: string

  @Column({
    name: 'latitud',
    type: 'double precision',
  })
  latitud?: number | null

  @Column({
    name: 'longitud',
    type: 'double precision',
  })
  longitud?: number | null

  @Column({
    name: 'lugar_secuestro',
    type: 'varchar',
    nullable: true,
  })
  lugarSecuestro?: string | null

  @Column({
    name: 'id_tipo_vinculo',
    type: 'integer',
    nullable: true,
  })
  idTipoVinculo?: number | null

  @Column({
    name: 'nombre_completo_vinculo',
    type: 'varchar',
    nullable: true,
  })
  nombreCompletoVinculo?: string | null

  @Column({
    name: 'cedula_identidad_vinculo',
    type: 'varchar',
    nullable: true,
  })
  cedulaIdentidadVinculo?: string | null

  @Column({
    name: 'autoridad_disposicion',
    type: 'varchar',
    nullable: true,
  })
  autoridadDisposicion?: string | null

  @Column({
    name: 'pericia',
    type: 'boolean',
    default: false,
  })
  pericia: boolean

  @Column({
    name: 'resultado_pericia',
    type: 'text',
    nullable: true,
  })
  resultadoPericia?: string | null

  @Column({
    name: 'fecha',
    type: 'timestamp with time zone',
    nullable: true,
  })
  fecha?: Date | null

  @Column({
    name: 'nombre_depositario',
    type: 'character varying',
    nullable: true,
  })
  nombreDepositario?: string | null

  @Column({
    name: 'ci_depositorio',
    type: 'character varying',
    nullable: true,
  })
  ciDepositario?: string | null

  @Column({
    name: 'ruta_fotografia_1',
    type: 'character varying',
    nullable: true,
  })
  rutaFotografia1?: string | null

  @Column({
    name: 'ruta_fotografia_2',
    type: 'character varying',
    nullable: true,
  })
  rutaFotografia2?: string | null

  @Column({
    name: 'estado',
    type: 'character varying',
    length: 15,
    default: 'ACTIVO',
  })
  estado: string

  // ==========================
  // RELACIONES
  // ==========================

  @ManyToOne(() => OperativoLgi)
  @JoinColumn({
    name: 'op_id',
  })
  operativo: OperativoLgi

  @ManyToOne(() => CatalogoTipoLgi)
  @JoinColumn({
    name: 'cattipo_id',
  })
  categoriaTipo: CatalogoTipoLgi

  @ManyToOne(() => TipoVinculoLgi)
  @JoinColumn({
    name: 'id_tipo_vinculo',
  })
  tipoVinculo?: TipoVinculoLgi | null
}
