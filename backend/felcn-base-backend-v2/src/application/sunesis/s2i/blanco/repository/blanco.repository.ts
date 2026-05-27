import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'

import { S2iBlanco } from '../entity/blanco.entity'
import { S2iAntecedenteBlanco } from '../entity/antecedente-blanco.entity'
import { S2iRedSocial } from '../entity/red-social.entity'
import { S2iLugarBlanco } from '../entity/lugar-blanco.entity'
import { S2iArchivoBlanco } from '../entity/archivo-blanco.entity'

@Injectable()
export class BlancoRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  // ==================== BLANCOS ====================

  async crear(blanco: S2iBlanco): Promise<S2iBlanco> {
    return this.dataSource.getRepository(S2iBlanco).save(blanco)
  }

  async buscarPorId(idBlanco: string): Promise<S2iBlanco | null> {
    return this.dataSource.getRepository(S2iBlanco).findOne({
      where: { idBlanco },
      relations: ['pais'],
    })
  }

  async listarPorCaso(idCaso: string): Promise<S2iBlanco[]> {
    return this.dataSource.getRepository(S2iBlanco).find({
      where: { idCaso },
      relations: ['pais'],
      order: { dePaterno: 'ASC', deMaterno: 'ASC', deNombres: 'ASC' },
    })
  }

  async eliminar(idBlanco: string): Promise<void> {
    await this.dataSource.getRepository(S2iBlanco).delete(idBlanco)
  }

  /** Actualiza sólo la columna foto (bytea) del blanco */
  async actualizarFoto(idBlanco: string, foto: Buffer): Promise<void> {
    await this.dataSource.getRepository(S2iBlanco).update(idBlanco, { foto })
  }

  async buscarFoto(idBlanco: string): Promise<Buffer | null> {
    const blanco = await this.dataSource.getRepository(S2iBlanco).findOne({
      select: ['foto'],
      where: { idBlanco },
    })
    return blanco?.foto ?? null
  }

  // ==================== ANTECEDENTES ====================

  async crearAntecedente(
    antecedente: S2iAntecedenteBlanco
  ): Promise<S2iAntecedenteBlanco> {
    return this.dataSource.getRepository(S2iAntecedenteBlanco).save(antecedente)
  }

  async listarAntecedentesPorBlanco(
    idBlanco: string
  ): Promise<S2iAntecedenteBlanco[]> {
    return this.dataSource.getRepository(S2iAntecedenteBlanco).find({
      where: { idBlanco },
      relations: ['tipoDelito', 'pais'],
      order: { fechaHecho: 'DESC' },
    })
  }

  async eliminarAntecedente(idAntecedente: string): Promise<void> {
    await this.dataSource
      .getRepository(S2iAntecedenteBlanco)
      .delete(idAntecedente)
  }

  // ==================== REDES SOCIALES ====================

  async crearRedSocial(red: S2iRedSocial): Promise<S2iRedSocial> {
    return this.dataSource.getRepository(S2iRedSocial).save(red)
  }

  async listarRedesPorBlanco(idBlanco: string): Promise<S2iRedSocial[]> {
    return this.dataSource
      .getRepository(S2iRedSocial)
      .find({ where: { idBlanco } })
  }

  async eliminarRedSocial(idRedSocial: string): Promise<void> {
    await this.dataSource.getRepository(S2iRedSocial).delete(idRedSocial)
  }

  // ==================== SIG ====================

  async crearLugar(lugar: S2iLugarBlanco): Promise<S2iLugarBlanco> {
    return this.dataSource.getRepository(S2iLugarBlanco).save(lugar)
  }

  async listarLugaresPorBlanco(idBlanco: string): Promise<S2iLugarBlanco[]> {
    return this.dataSource
      .getRepository(S2iLugarBlanco)
      .find({ where: { idBlanco } })
  }

  async eliminarLugar(idLugarBlanco: string): Promise<void> {
    await this.dataSource.getRepository(S2iLugarBlanco).delete(idLugarBlanco)
  }

  // ==================== ARCHIVOS ====================

  async crearArchivo(archivo: S2iArchivoBlanco): Promise<S2iArchivoBlanco> {
    return this.dataSource.getRepository(S2iArchivoBlanco).save(archivo)
  }

  async listarArchivosPorBlanco(idBlanco: string): Promise<S2iArchivoBlanco[]> {
    return this.dataSource.getRepository(S2iArchivoBlanco).find({
      select: [
        'idArchivo',
        'idBlanco',
        'idContenidoCaso',
        'tipo',
        'nombre',
        'nombreArchivo',
      ],
      where: { idBlanco },
      relations: ['contenidoCaso'],
    })
  }

  async buscarArchivoPorId(
    idArchivo: string
  ): Promise<S2iArchivoBlanco | null> {
    return this.dataSource
      .getRepository(S2iArchivoBlanco)
      .findOne({ where: { idArchivo } })
  }

  async eliminarArchivo(idArchivo: string): Promise<void> {
    await this.dataSource.getRepository(S2iArchivoBlanco).delete(idArchivo)
  }
}
