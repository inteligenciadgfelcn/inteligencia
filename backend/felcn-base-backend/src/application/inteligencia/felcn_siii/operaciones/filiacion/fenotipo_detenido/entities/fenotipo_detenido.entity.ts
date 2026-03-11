import { ColorCabello } from '@/application/inteligencia/felcn_siii/parametricas/color_cabello/entities/color_cabello.entity'
import { ColorOjo } from '@/application/inteligencia/felcn_siii/parametricas/color_ojos/entities/color_ojo.entity'
import { ColorPiel } from '@/application/inteligencia/felcn_siii/parametricas/color_piel/entities/color_piel.entity'
import { ConstitucionCorporal } from '@/application/inteligencia/felcn_siii/parametricas/constitucion_corporal/entities/constitucion_corporal.entity'
import { TipoCabello } from '@/application/inteligencia/felcn_siii/parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { TipoNariz } from '@/application/inteligencia/felcn_siii/parametricas/tipo_nariz/entities/tipo_nariz.entity'
import { TipoOjo } from '@/application/inteligencia/felcn_siii/parametricas/tipo_ojos/entities/tipo_ojo.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Detenido } from '../../detenido/entities/detenido.entity'

@Entity({ name: 'fenotipo_detenido', schema: 'public' })
export class FenotipoDetenido {
  
 @PrimaryGeneratedColumn({
    name: 'id_fenotipo_detenido',
    type: 'int',
  })
  idFenotipoDetenido: number

  @ManyToOne(() => Detenido)
  @JoinColumn({ name: 'id_detenido' })
  detenido: Detenido

  @Column({
    name: 'fecha',
    type: 'timestamp'
  })
  fecha: Date

  @Column({
    name: 'estatura',
    type: 'varchar',
    length: 10
  })
  estatura: string

  @Column({
    name: 'peso_corporal',
    type: 'varchar',
    length: 10,
    nullable: true
  })
  pesoCorporal: string

  @Column({
    name: 'sena_particular',
    type: 'varchar',
    length: 255,
    nullable: true
  })
  senasParticulares: string

  @Column({
    name: 'tatuaje',
    type: 'varchar',
    length: 255,
    nullable: true
  })
  tatuaje: string

  @ManyToOne(() => TipoNariz)
  @JoinColumn({ name: 'id_tipo_nariz' })
  tipoNariz: TipoNariz

  @ManyToOne(() => ConstitucionCorporal)
  @JoinColumn({ name: 'id_constitucion_corporal' })
  constitucionCorporal: ConstitucionCorporal

  @ManyToOne(() => ColorPiel)
  @JoinColumn({ name: 'id_color_piel' })
  colorPiel: ColorPiel

  @ManyToOne(() => ColorCabello)
  @JoinColumn({ name: 'id_color_cabello' })
  colorCabello: ColorCabello

  @ManyToOne(() => TipoCabello)
  @JoinColumn({ name: 'id_tipo_cabello' })
  tipoCabello: TipoCabello

  @ManyToOne(() => ColorOjo)
  @JoinColumn({ name: 'id_color_ojos' })
  colorOjos: ColorOjo

  @ManyToOne(() => TipoOjo)
  @JoinColumn({ name: 'id_tipo_ojos' })
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
