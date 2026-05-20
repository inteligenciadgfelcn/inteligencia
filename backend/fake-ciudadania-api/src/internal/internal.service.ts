import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { CiudadaniaUsuario } from '../database/entities/ciudadania-usuario.entity'

export interface CrearUsuarioInternoDto {
  ci: string
  password: string
  email: string
  nombres: string
  primerApellido: string
  segundoApellido?: string | null
  fechaNacimiento: string // DD/MM/YYYY
  celular?: string | null
}

/**
 * Servicio interno — usado únicamente por el endpoint /internal/usuarios.
 * Permite que auth-backend registre usuarios en el fake de Ciudadanía Digital
 * automáticamente al dar de alta un nuevo usuario.
 *
 * Al desacoplar el fake se elimina este módulo completo sin afectar nada más.
 */
@Injectable()
export class InternalService {
  constructor(
    @InjectRepository(CiudadaniaUsuario)
    private usuarioRepo: Repository<CiudadaniaUsuario>
  ) {}

  async crearUsuario(dto: CrearUsuarioInternoDto): Promise<{ creado: boolean; ci: string }> {
    const existing = await this.usuarioRepo.findOne({ where: { ci: dto.ci } })
    if (existing) {
      return { creado: false, ci: dto.ci }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)
    const usuario = this.usuarioRepo.create({
      ci: dto.ci,
      passwordHash,
      email: dto.email,
      nombres: dto.nombres,
      primerApellido: dto.primerApellido,
      segundoApellido: dto.segundoApellido ?? null,
      fechaNacimiento: dto.fechaNacimiento,
      celular: dto.celular ?? null,
      estado: 'ACTIVO',
    })

    await this.usuarioRepo.save(usuario)
    return { creado: true, ci: dto.ci }
  }
}
