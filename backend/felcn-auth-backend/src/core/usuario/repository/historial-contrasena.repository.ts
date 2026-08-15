import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { HistorialContrasena } from '../entity/historial-contrasena.entity'

@Injectable()
export class HistorialContrasenaRepository {
  constructor(private dataSource: DataSource) {}

  async guardar(idUsuario: string, contrasena: string) {
    return await this.dataSource
      .getRepository(HistorialContrasena)
      .save(new HistorialContrasena({ idUsuario, contrasena }))
  }

  /** Últimos N hashes de contraseña que tuvo el usuario, más reciente primero. */
  async obtenerUltimas(idUsuario: string, cantidad: number) {
    return await this.dataSource
      .getRepository(HistorialContrasena)
      .createQueryBuilder('historial')
      .where('historial.idUsuario = :idUsuario', { idUsuario })
      .orderBy('historial._fecha_creacion', 'DESC')
      .limit(cantidad)
      .getMany()
  }
}
