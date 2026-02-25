import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_ASIG_CASOS } from '../../../shared/constants'
import { DepartamentoCaso } from '../entity/departamento-caso.entity'
import { UnidadCaso } from '../entity/unidad-caso.entity'
import { Letra } from '../entity/letra.entity'
import { UsuarioUnidad } from '../entity/usuario-unidad.entity'
import { UsuarioIcia } from '../entity/usuario-icia.entity'

@Injectable()
export class AsigLookupRepository {
  constructor(
    @InjectDataSource(DB_ASIG_CASOS)
    private dataSource: DataSource,
  ) {}

  // Departamentos
  async listarDepartamentos(): Promise<DepartamentoCaso[]> {
    return this.dataSource
      .getRepository(DepartamentoCaso)
      .createQueryBuilder('departamento')
      .orderBy('departamento.descripcion', 'ASC')
      .getMany()
  }

  async buscarDepartamentoPorId(
    idDepartamento: string,
  ): Promise<DepartamentoCaso | null> {
    return this.dataSource
      .getRepository(DepartamentoCaso)
      .findOne({ where: { idDepartamento } })
  }

  // Unidades
  async listarUnidades(): Promise<UnidadCaso[]> {
    return this.dataSource
      .getRepository(UnidadCaso)
      .createQueryBuilder('unidad')
      .orderBy('unidad.descripcion', 'ASC')
      .getMany()
  }

  async buscarUnidadPorId(idUnidad: string): Promise<UnidadCaso | null> {
    return this.dataSource
      .getRepository(UnidadCaso)
      .findOne({ where: { idUnidad } })
  }

  // Letras
  async listarLetras(): Promise<Letra[]> {
    return this.dataSource
      .getRepository(Letra)
      .createQueryBuilder('letra')
      .where('letra.esMostrable = true')
      .orderBy('letra.codigo', 'ASC')
      .getMany()
  }

  async buscarLetraPorCodigo(codigo: string): Promise<Letra | null> {
    return this.dataSource.getRepository(Letra).findOne({ where: { codigo } })
  }

  // Usuario Unidad
  async listarUnidadesPorUsuario(usuarioLogin: string): Promise<UsuarioUnidad[]> {
    return this.dataSource
      .getRepository(UsuarioUnidad)
      .createQueryBuilder('usuarioUnidad')
      .leftJoinAndSelect('usuarioUnidad.departamento', 'departamento')
      .leftJoinAndSelect('usuarioUnidad.unidad', 'unidad')
      .where('usuarioUnidad.usuarioLogin = :usuarioLogin', { usuarioLogin })
      .getMany()
  }

  // Usuario ICIA
  async buscarUsuarioIcia(usuarioLogin: string): Promise<UsuarioIcia | null> {
    return this.dataSource
      .getRepository(UsuarioIcia)
      .findOne({ where: { usuarioLogin } })
  }
}
