import { Injectable, NotFoundException } from '@nestjs/common'
import { TelefoniaRepository } from '../repository/telefonia.repository'
import { S2iTelefono } from '../entity/telefono.entity'
import { CreateTelefonoDto } from '../dto'

@Injectable()
export class TelefoniaService {
  constructor(private readonly repo: TelefoniaRepository) {}

  // ==================== TELÉFONOS ====================

  async crearTelefono(
    idCaso: string,
    dto: CreateTelefonoDto,
    usuario: string
  ): Promise<S2iTelefono> {
    const telefono = new S2iTelefono({
      idCaso,
      numero1: dto.numero1.trim(),
      propietario1: dto.propietario1.trim().toUpperCase(),
      mensaje: dto.mensaje.trim(),
      numero2: dto.numero2.trim(),
      propietario2: dto.propietario2.trim().toUpperCase(),
      usuario: usuario.trim(),
    })
    return this.repo.crearTelefono(telefono)
  }

  async listarTelefonosPorCaso(idCaso: string): Promise<S2iTelefono[]> {
    return this.repo.listarTelefonosPorCaso(idCaso)
  }

  async buscarTelefonoPorId(idTelefono: string): Promise<S2iTelefono> {
    const telefono = await this.repo.buscarTelefonoPorId(idTelefono)
    if (!telefono)
      throw new NotFoundException(`Teléfono ${idTelefono} no encontrado`)
    return telefono
  }

  async eliminarTelefono(idTelefono: string): Promise<void> {
    const existe = await this.repo.buscarTelefonoPorId(idTelefono)
    if (!existe)
      throw new NotFoundException(`Teléfono ${idTelefono} no encontrado`)
    await this.repo.eliminarTelefono(idTelefono)
  }
}
