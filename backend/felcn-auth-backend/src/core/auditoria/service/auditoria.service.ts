import { Injectable } from '@nestjs/common'
import { BitacoraLoginRepository, RegistrarLoginParams } from '../repository/bitacora-login.repository'
import { AuditoriaCambioRepository, RegistrarCambioParams } from '../repository/auditoria-cambio.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class AuditoriaService {
  constructor(
    private bitacoraLoginRepo: BitacoraLoginRepository,
    private auditoriaCambioRepo: AuditoriaCambioRepository
  ) {}

  async registrarLogin(params: RegistrarLoginParams) {
    return await this.bitacoraLoginRepo.registrar(params)
  }

  async registrarCambio(params: RegistrarCambioParams) {
    return await this.auditoriaCambioRepo.registrar(params)
  }

  async listarBitacoraLogin(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto
    return await this.bitacoraLoginRepo.listar(limite, saltar)
  }

  async listarBitacoraLoginPorUsuario(idUsuario: string, limite = 20) {
    return await this.bitacoraLoginRepo.listarPorUsuario(idUsuario, limite)
  }

  async listarAuditoriaCambios(tabla?: string, paginacionQueryDto?: PaginacionQueryDto) {
    const limite = paginacionQueryDto?.limite ?? 50
    const saltar = paginacionQueryDto?.saltar ?? 0
    return await this.auditoriaCambioRepo.listar(tabla, limite, saltar)
  }
}
