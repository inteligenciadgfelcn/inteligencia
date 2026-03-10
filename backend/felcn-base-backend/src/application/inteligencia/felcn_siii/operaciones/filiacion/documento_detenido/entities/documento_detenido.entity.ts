import { TipoDocumento } from '@/application/inteligencia/felcn_siii/parametricas/tipo_documento/entities/tipo_documento.entity'
import { PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Entity } from 'typeorm'

@Entity({ name: 'docuemnto_detenido', schema: 'public' })
export class DocumentoDetenido {
  @PrimaryGeneratedColumn({
    name: 'id_detenido_auxiliar',
    type: 'int',
    comment: 'Clave primaria del registro de filiación del detenido',
  })
  idDetenidoAuxiliar: number

  @Column({
    name: 'id_operativo',
    type: 'int',
    nullable: true,
    comment: 'Identificador del operativo relacionado',
  })
  idOperativo: number

  @ManyToOne(() => TipoDocumento, { nullable: true })
  @JoinColumn({
    name: 'id_tipo_documento',
  })
  tipoDocumento: TipoDocumento

  @Column({
    name: 'numero_documento',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de documento',
  })
  numeroDocumento: string

  @Column({
    name: 'expedido',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Expedido',
  })
  expedido: string

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
