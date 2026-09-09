import { Grupo } from "@/application/inteligencia/felcn_asignacion_caso/grupo/entities/grupo.entity"
import { Unidad } from "@/application/inteligencia/felcn_asignacion_caso/unidad/entities/unidad.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { CategoriaOperativo } from "../../parametrica/categoria_operativo/entities/categoria_operativo.entity"
import { ItemOperativo } from "../../parametrica/item_operativo/entities/item_operativo.entity"
import { Departamento } from "../../parametrica/provincia/entities/departamento.entity"
import { Provincia } from "../../parametrica/provincia/entities/provincia.entity"
import { DepartamentoSospechoso } from "../../detenido/entities/departamento-sospechoso.entity"
import { GrupoSospechoso } from "../../parametrica/grupo-sospechoso/entities/grupo-sospechoso.entity"
import { DistritoSospechoso } from "../../parametrica/distrito-sospechoso/entities/distrito-sospechoso.entity"
import { UnidadSospechoso } from "../../parametrica/unidad-sospechoso/entities/unidad.entity"
import { Localidad } from "../../parametrica/localidad/entities/localidad.entity"

@Entity({ name: 'operativo', schema: 'public' })
export class Operativo {
  @PrimaryGeneratedColumn({
    name: 'id_operativo',
    type: 'int',
  })
  idOperativo!: number

  @Column({
    name: 'numero_caso',
    type: 'varchar',
    nullable: false,
  })
  numeroCaso!: string

  @Column({
    name: 'numero_operativo',
    type: 'varchar',
    nullable: true,
  })
  numeroOperativo!: string

  @Column({
    name: 'fecha_operativo',
    type: 'timestamp',
    nullable: true,
  })
  fechaOperativo!: Date

  @Column({
    name: 'id_departamento',
    type: 'int',
  })
  idDepartamento!: number

  @Column({
    name: 'id_provincia',
    type: 'int',
  })
  idProvincia!: number

  @Column({
    name: 'id_localidad',
    type: 'int',
  })
  idLocalidad!: number

  @Column({
    name: 'lugar',
    type: 'varchar',
    nullable: true,
  })
  lugar!: string

  @Column({
    name: 'id_categoria_operativo',
    type: 'int',
  })
  idCategoriaOperativo!: number

  @Column({
    name: 'id_item_operativo',
    type: 'int',
  })
  idItemOperativo!: number

  @Column({
    name: 'id_unidad',
    type: 'int',
  })
  idUnidad!: number

  @Column({
    name: 'id_distrital',
    type: 'int',
  })
  idDistrital!: number

  @Column({
    name: 'id_grupo',
    type: 'int',
  })
  idGrupo!: number

  @Column({
    name: 'mando',
    type: 'varchar',
    nullable: true,
  })
  mando!: string

  @Column({
    name: 'descripcion',
    type: 'varchar',
    nullable: true,
  })
  descripcion!: string

  @Column({
    name: 'revisado',
    type: 'boolean',
    default: false,
  })
  revisado!: boolean

  @Column({
    name: 'actualizacion',
    type: 'varchar',
    nullable: true,
  })
  actualizacion!: string

  @Column({
    name: 'fecha_creacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaCreacion!: Date

  @Column({
    name: 'usuario_creacion',
    type: 'varchar',
    nullable: true,
  })
  usuarioCreacion!: string

  @Column({
    name: 'fecha_actualizacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaActualizacion!: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    nullable: true,
  })
  usuarioActualizacion!: string


  @ManyToOne(() => DepartamentoSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_departamento' })
  departamento!: DepartamentoSospechoso

  @ManyToOne(() => Provincia, { nullable: true })
  @JoinColumn({ name: 'id_provincia' })
  provincia!: Provincia

  @ManyToOne(() => Localidad, { nullable: true })
  @JoinColumn({ name: 'id_localidad' })
  municipio!: Localidad

  @ManyToOne(() => UnidadSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_unidad' })
  unidad!: UnidadSospechoso

  @ManyToOne(() => DistritoSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_distrital' })
  distrito!: DistritoSospechoso

  @ManyToOne(() => GrupoSospechoso, { nullable: true })
  @JoinColumn({ name: 'id_grupo' })
  grupo!: GrupoSospechoso

  @ManyToOne(() => CategoriaOperativo, { nullable: true })
  @JoinColumn({ name: 'id_categoria_operativo' })
  categoriaOperativo!: CategoriaOperativo

  @ManyToOne(() => ItemOperativo, { nullable: true })
  @JoinColumn({ name: 'id_item_operativo' })
  itemOperativo!: ItemOperativo

}