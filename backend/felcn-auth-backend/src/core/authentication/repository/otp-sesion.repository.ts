import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { OtpSesion } from '../entity/otp-sesion.entity'

@Injectable()
export class OtpSesionRepository {
  constructor(private dataSource: DataSource) {}

  async crear(data: Partial<OtpSesion>): Promise<OtpSesion> {
    return await this.dataSource.getRepository(OtpSesion).save(data)
  }

  async buscarPorId(id: string): Promise<OtpSesion | null> {
    return await this.dataSource
      .getRepository(OtpSesion)
      .createQueryBuilder('otp')
      .where('otp.id = :id', { id })
      .getOne()
  }

  async contarRecientesDeUsuario(idUsuario: string, segundos: number): Promise<number> {
    const desde = new Date(Date.now() - segundos * 1000)
    return await this.dataSource
      .getRepository(OtpSesion)
      .createQueryBuilder('otp')
      .where('otp.id_usuario = :idUsuario', { idUsuario })
      .andWhere('otp.fecha_creacion >= :desde', { desde })
      .getCount()
  }

  async invalidarPendientes(idUsuario: string): Promise<void> {
    await this.dataSource
      .getRepository(OtpSesion)
      .createQueryBuilder()
      .update(OtpSesion)
      .set({ consumido: true })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('consumido = false')
      .execute()
  }

  async incrementarIntentos(id: string): Promise<void> {
    await this.dataSource
      .getRepository(OtpSesion)
      .createQueryBuilder()
      .update(OtpSesion)
      .set({ intentos: () => 'intentos + 1' })
      .where('id = :id', { id })
      .execute()
  }

  async consumir(id: string): Promise<void> {
    await this.dataSource.getRepository(OtpSesion).update(id, { consumido: true })
  }

  async limpiarExpiradas(): Promise<void> {
    await this.dataSource
      .getRepository(OtpSesion)
      .createQueryBuilder()
      .delete()
      .from(OtpSesion)
      .where('expiracion < NOW()')
      .andWhere('consumido = true')
      .execute()
  }
}
