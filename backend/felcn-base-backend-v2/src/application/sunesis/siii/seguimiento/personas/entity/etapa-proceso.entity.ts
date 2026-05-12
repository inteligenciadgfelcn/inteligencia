import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { SCHEMA_PUBLIC } from '../../../../shared/constants'
import { DetenidoAuxiliar } from '../../../operativo/entity/detenido-auxiliar.entity'
import { Estado } from './estado.entity'

/**
 * Entidad EtapaProceso
 * Historial de etapas del proceso legal de un implicado.
 * Origen: FRM-JUR-02.aspx.cs — btnguardaetapa_Click / Muestraetapas
 * Tabla: public.etapa_proceso
 */
@Entity({ name: 'etapa_proceso', schema: SCHEMA_PUBLIC })
export class EtapaProceso {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id_etapa_proceso' })
  id: string

  @Column({ name: 'id_detenido_auxiliar', type: 'bigint' })
  idDetenidoAuxiliar: string

  @Column({ name: 'id_estado', type: 'integer' })
  idEstado: number

  @Column({ name: 'nro_resolucion', type: 'varchar', length: 50 })
  nroResolucion: string

  @Column({ name: 'lugar', type: 'varchar', length: 100 })
  lugar: string

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date

  @Column({ name: 'autoridad', type: 'varchar', length: 150 })
  autoridad: string

  @Column({ name: 'fjt', type: 'varchar', length: 100 })
  fjt: string

  @ManyToOne(() => DetenidoAuxiliar)
  @JoinColumn({ name: 'id_detenido_auxiliar' })
  detenidoAuxiliar?: DetenidoAuxiliar

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'id_estado' })
  estado?: Estado

  constructor(data?: Partial<EtapaProceso>) {
    if (data) Object.assign(this, data)
  }
}
