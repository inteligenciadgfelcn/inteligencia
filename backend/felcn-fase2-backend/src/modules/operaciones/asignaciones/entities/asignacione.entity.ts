import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';

import { BaseStatusEntity } from 'src/common/entity/base-status.entity';
import { Departamento } from 'src/modules/parametros/departamentos/entities/departamento.entity';
import { Grupo } from 'src/modules/usuario/grupos/entities/grupo.entity';
import { Letra } from 'src/modules/parametros/letras/entities/letra.entity';

@Entity({
  name: 'asignacion',
  schema: 'operaciones',
})
export class Asignacion extends BaseStatusEntity {
  @ManyToOne(() => Departamento, { nullable: false })
  @JoinColumn({ name: 'id_departamento' })
  departamento: Departamento;

  @ManyToOne(() => Grupo, { nullable: false })
  @JoinColumn({ name: 'id_grupo',  referencedColumnName: 'id' })
  grupo: Grupo;

  @ManyToOne(() => Letra, { nullable: true })
  @JoinColumn({ name: 'id_letras' })
  letras: Letra;

  @Column({
    name: 'nro_caso',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso generado por departamento y letra por gestión',
  })
  nroCaso: string;

  @Column({
    name: 'nro_caso_per_dom',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Número de caso correspondiente a PER-DOM si aplica',
  })
  nroCasoPerDom: string;

  @Column({
    name: 'nro_operativo',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment:
      'Número único de operativo generado por departamento y unidad por gestión',
  })
  nroOperativo: string;

  @Column({
    name: 'codigo_servicio',
    type: 'varchar',
    length: 100,
    comment: 'Código interno del servicio asociado a la asignación',
  })
  codigoServicio: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Código IANUS asociado al caso si corresponde',
  })
  ianus: string;

  @Column({
    name: 'nombre_caso',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Nombre descriptivo del caso',
  })
  nombreCaso: string;

  @Column({
    name: 'fecha_solicitud',
    type: 'varchar',
    nullable: true,
    comment: 'Fecha en la que se realizó la solicitud',
  })
  fechaSolicitud: string;

  @Column({
    name: 'nombre_solicitud',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Nombre del solicitante',
  })
  nombreSolicitud: string;

  @Column({
    name: 'telefono_solicitud',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono de contacto del solicitante',
  })
  telefonoSolicitud: string;

  @Column({
    type: 'varchar',
    length: 150,
    comment: 'Nombre del investigador o responsable asignado',
  })
  asignado: string;

  @Column({
    name: 'telefono_asignado',
    type: 'varchar',
    length: 20,
    comment: 'Teléfono del responsable asignado',
  })
  telefonoAsignado: string;

  @Column({
    name: 'fiscal_asignado',
    type: 'varchar',
    length: 150,
    comment: 'Nombre del fiscal asignado al caso',
  })
  fiscalAsignado: string;

  @Column({
    name: 'telefono_fiscal',
    type: 'varchar',
    length: 20,
    comment: 'Teléfono de contacto del fiscal asignado',
  })
  telefonoFiscal: string;

  @Column({
    name: 'eta_inv',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 7,
    comment: 'Tiempo estimado de investigación en días (por defecto 7)',
  })
  etaInv: number;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el operativo tuvo resultado positivo',
  })
  resultado: boolean;

  constructor(data?: Partial<Asignacion>) {
    super(data);
  }
}
