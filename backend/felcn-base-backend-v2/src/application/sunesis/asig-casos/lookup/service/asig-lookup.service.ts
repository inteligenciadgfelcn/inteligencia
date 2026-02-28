import { Injectable, NotFoundException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { AsigLookupRepository } from '../repository/asig-lookup.repository'
import { DepartamentoCaso } from '../entity/departamento-caso.entity'
import { UnidadCaso } from '../entity/unidad-caso.entity'
import { Letra } from '../entity/letra.entity'
import { UsuarioUnidad } from '../entity/usuario-unidad.entity'
import { UsuarioIcia } from '../entity/usuario-icia.entity'

@Injectable()
export class AsigLookupService extends BaseService {
  constructor(private readonly lookupRepository: AsigLookupRepository) {
    super()
  }

  // Departamentos
  async listarDepartamentos(): Promise<DepartamentoCaso[]> {
    return this.lookupRepository.listarDepartamentos()
  }

  async buscarDepartamentoPorId(
    idDepartamento: string
  ): Promise<DepartamentoCaso> {
    const departamento =
      await this.lookupRepository.buscarDepartamentoPorId(idDepartamento)
    if (!departamento) {
      throw new NotFoundException(
        `Departamento con ID ${idDepartamento} no encontrado`
      )
    }
    return departamento
  }

  // Unidades
  async listarUnidades(): Promise<UnidadCaso[]> {
    return this.lookupRepository.listarUnidades()
  }

  async buscarUnidadPorId(idUnidad: string): Promise<UnidadCaso> {
    const unidad = await this.lookupRepository.buscarUnidadPorId(idUnidad)
    if (!unidad) {
      throw new NotFoundException(`Unidad con ID ${idUnidad} no encontrada`)
    }
    return unidad
  }

  // Letras
  async listarLetras(): Promise<Letra[]> {
    return this.lookupRepository.listarLetras()
  }

  async buscarLetraPorCodigo(codigo: string): Promise<Letra> {
    const letra = await this.lookupRepository.buscarLetraPorCodigo(codigo)
    if (!letra) {
      throw new NotFoundException(`Letra con código ${codigo} no encontrada`)
    }
    return letra
  }

  // Usuario Unidad
  async listarUnidadesPorUsuario(
    usuarioLogin: string
  ): Promise<UsuarioUnidad[]> {
    return this.lookupRepository.listarUnidadesPorUsuario(usuarioLogin)
  }

  // Usuario ICIA
  async buscarUsuarioIcia(usuarioLogin: string): Promise<UsuarioIcia> {
    const usuarioIcia =
      await this.lookupRepository.buscarUsuarioIcia(usuarioLogin)
    if (!usuarioIcia) {
      throw new NotFoundException(
        `Usuario ICIA con login ${usuarioLogin} no encontrado`
      )
    }
    return usuarioIcia
  }
}
