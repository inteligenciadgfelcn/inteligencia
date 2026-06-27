import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { BitacoraLogin } from '../entity/bitacora-login.entity'

@Injectable()
export class BitacoraLoginRepository {
  constructor(private readonly dataSource: DataSource) {}

  async registrar(datos: {
    idUsuario?: string
    usuario: string
    ipOrigen: string
    userAgent?: string
    metodoAutenticacion: string
    exitoso: boolean
    motivoFallo?: string
    sessionId?: string
    dispositivo?: string
  }): Promise<void> {
    await this.dataSource.getRepository(BitacoraLogin).save(datos)
  }
}
