import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { EstadoCivil } from '../../../parametricas/estado_civil/entities/estado_civil.entity'
import { Pais } from '../../../parametricas/pais/entities/pais.entity'
import { TipoNariz } from '../../../parametricas/tipo_nariz/entities/tipo_nariz.entity'
import { ConstitucionCorporal } from '../../../parametricas/constitucion_corporal/entities/constitucion_corporal.entity'
import { ColorPiel } from '../../../parametricas/color_piel/entities/color_piel.entity'
import { ColorCabello } from '../../../parametricas/color_cabello/entities/color_cabello.entity'
import { TipoCabello } from '../../../parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { ColorOjo } from '../../../parametricas/color_ojos/entities/color_ojo.entity'
import { TipoOjo } from '../../../parametricas/tipo_ojos/entities/tipo_ojo.entity'

@Entity({ name: 'fenotipo_detenido', schema: 'public' })
export class Filiacion {
  @PrimaryGeneratedColumn({
    name: 'id_fenotipo_detenido',
    type: 'int',
    comment: 'Clave primaria del registro',
  })
  idFenotipoDetenido: number

  @Column({
    name: 'id_detenido',
    type: 'int',
    nullable: true,
    comment: 'Identificador del detenido',
  })
  idDetenido: number

  @Column({
    name: 'fecha',
    type: 'timestamp',
    length: 50,
    nullable: true,
    comment: 'Fecha',
  })
  fecha: Date

  @Column({
    name: 'estatura',
    type: 'varchar',
    length: 10,
    comment: 'Estatura del detenido',
  })
  estatura: string

  @Column({
    name: 'peso',
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Peso del detenido',
  })
  apellidoPaterno: string

  @Column({
    name: 'sena_particular',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Señas particulares del detenido',
  })
  senasParticulares: string

  @Column({
    name: 'tatuaje',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Tatuajes del detenido',
  })
  tatuaje: string

  @ManyToOne(() => TipoNariz, { nullable: true })
  @JoinColumn({
    name: 'id_tipo_nariz',
  })
  tipoNariz: TipoNariz

  @ManyToOne(() => ConstitucionCorporal, { nullable: true })
  @JoinColumn({
    name: 'id_constitucion_coorporal',
  })
  constitucionCorporal: ConstitucionCorporal

  @ManyToOne(() => ColorPiel, { nullable: true })
  @JoinColumn({
    name: 'id_color_piel',
  })
  colorPiel: ColorPiel

  @ManyToOne(() => ColorCabello, { nullable: true })
  @JoinColumn({
    name: 'id_color_cabello',
  })
  colorCabello: ColorCabello

  @ManyToOne(() => TipoCabello, { nullable: true })
  @JoinColumn({
    name: 'id_tipo_cabello',
  })
  tipoCabello: TipoCabello

  @ManyToOne(() => ColorOjo, { nullable: true })
  @JoinColumn({
    name: 'id_tipo_cabello',
  })
  colorOjos: ColorOjo

  @ManyToOne(() => TipoOjo, { nullable: true })
  @JoinColumn({
    name: 'id_tipo_cabello',
  })
  tipoOjos: TipoOjo

  @Column({
    name: 'fecha_hora_ingreso',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha y hora de ingreso del registro',
  })
  fechaHoraIngreso: Date

  @Column({
    name: 'usuario',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Usuario que registró la información',
  })
  usuario: string

  @Column({
    name: 'fecha_hora_actualizacion',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha y hora de última actualización',
  })
  fechaHoraActualizacion: Date

  @Column({
    name: 'usuario_actualizacion',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Usuario que realizó la última actualización',
  })
  usuarioActualizacion: string
}
