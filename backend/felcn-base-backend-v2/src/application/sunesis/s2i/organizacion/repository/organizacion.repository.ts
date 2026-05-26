import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'

import { S2iEmpresa } from '../entity/empresa.entity'
import { S2iLugarEmpresa } from '../entity/lugar-empresa.entity'
import { S2iArchivoOrganizacion } from '../entity/archivo-organizacion.entity'

@Injectable()
export class OrganizacionRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // ==================== ORGANIZACIONES ====================

  async crear(empresa: S2iEmpresa): Promise<S2iEmpresa> {
    return this.dataSource.getRepository(S2iEmpresa).save(empresa)
  }

  async buscarPorId(idEmpresa: string): Promise<S2iEmpresa | null> {
    return this.dataSource.getRepository(S2iEmpresa).findOne({
      where: { idEmpresa },
      relations: ['tipoOrganizacion'],
    })
  }

  async listarPorCaso(idCaso: string): Promise<S2iEmpresa[]> {
    return this.dataSource.getRepository(S2iEmpresa).find({
      where: { idCaso },
      relations: ['tipoOrganizacion'],
      order: { nombre: 'ASC' },
    })
  }

  async eliminar(idEmpresa: string): Promise<void> {
    await this.dataSource.getRepository(S2iEmpresa).delete(idEmpresa)
  }

  // ==================== GIS ====================

  async crearLugar(lugar: S2iLugarEmpresa): Promise<S2iLugarEmpresa> {
    return this.dataSource.getRepository(S2iLugarEmpresa).save(lugar)
  }

  async listarLugaresPorEmpresa(idEmpresa: string): Promise<S2iLugarEmpresa[]> {
    return this.dataSource
      .getRepository(S2iLugarEmpresa)
      .find({ where: { idEmpresa } })
  }

  async eliminarLugar(idLugarEmpresa: string): Promise<void> {
    await this.dataSource.getRepository(S2iLugarEmpresa).delete(idLugarEmpresa)
  }

  // ==================== ARCHIVOS ====================

  async crearArchivo(
    archivo: S2iArchivoOrganizacion
  ): Promise<S2iArchivoOrganizacion> {
    return this.dataSource.getRepository(S2iArchivoOrganizacion).save(archivo)
  }

  async listarArchivosPorEmpresa(
    idEmpresa: string
  ): Promise<S2iArchivoOrganizacion[]> {
    return this.dataSource.getRepository(S2iArchivoOrganizacion).find({
      select: [
        'idArchivo',
        'idEmpresa',
        'idContenidoCaso',
        'tipo',
        'nombre',
        'nombreArchivo',
      ],
      where: { idEmpresa },
      relations: ['contenidoCaso'],
    })
  }

  async buscarArchivoPorId(
    idArchivo: string
  ): Promise<S2iArchivoOrganizacion | null> {
    return this.dataSource
      .getRepository(S2iArchivoOrganizacion)
      .findOne({ where: { idArchivo } })
  }

  async eliminarArchivo(idArchivo: string): Promise<void> {
    await this.dataSource
      .getRepository(S2iArchivoOrganizacion)
      .delete(idArchivo)
  }
}
