import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BitacoraLogin } from '../entity/bitacora-login.entity'
import { MetodoAutenticacion } from '../constant'

export interface RegistrarLoginParams {
  idUsuario?: string | null
  usuario?: string | null
  ipOrigen?: string | null
  userAgent?: string | null
  metodoAutenticacion?: string
  exitoso: boolean
  motivoFallo?: string | null
  sessionId?: string | null
  dispositivo?: string | null
}

@Injectable()
export class BitacoraLoginRepository {
  constructor(private dataSource: DataSource) {}

  async registrar(params: RegistrarLoginParams) {
    const registro = new BitacoraLogin()
    registro.idUsuario = params.idUsuario ?? null
    registro.usuario = params.usuario ?? null
    registro.ipOrigen = params.ipOrigen ?? null
    registro.userAgent = params.userAgent ?? null
    registro.metodoAutenticacion = params.metodoAutenticacion ?? MetodoAutenticacion.LOCAL
    registro.exitoso = params.exitoso
    registro.motivoFallo = params.motivoFallo ?? null
    registro.sessionId = params.sessionId ?? null
    registro.dispositivo = params.dispositivo ?? null

    return await this.dataSource.getRepository(BitacoraLogin).save(registro)
  }

  async listarPorUsuario(idUsuario: string, limite = 20) {
    return await this.dataSource
      .getRepository(BitacoraLogin)
      .createQueryBuilder('bitacora')
      .where('bitacora.id_usuario = :idUsuario', { idUsuario })
      .orderBy('bitacora.fecha_hora', 'DESC')
      .take(limite)
      .getMany()
  }

  async listar(limite: number, saltar: number) {
    return await this.dataSource
      .getRepository(BitacoraLogin)
      .createQueryBuilder('bitacora')
      .orderBy('bitacora.fecha_hora', 'DESC')
      .take(limite)
      .skip(saltar)
      .getManyAndCount()
  }

  async contarIntentosFallidos(idUsuario: string, desdeMinutos = 30) {
    const desde = new Date(Date.now() - desdeMinutos * 60 * 1000)
    return await this.dataSource
      .getRepository(BitacoraLogin)
      .createQueryBuilder('bitacora')
      .where('bitacora.id_usuario = :idUsuario', { idUsuario })
      .andWhere('bitacora.exitoso = false')
      .andWhere('bitacora.fecha_hora >= :desde', { desde })
      .getCount()
  }
}
