import { DB_LGI } from '@/core/config/database/database.module'
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TipoSituacionJuridica } from '../../parametro/parametricas_lgi/entity/tipo_situacion_juridica.entity'
import { PersonasJuridica } from '../../personas_juridicas/entities/personas_juridica.entity'
import { CreateSituacionJuridicaEmpresaDto } from '../dto/create-situacion_jurica_empresa.dto'
import { SituacionJuridicaEmpresa } from '../entities/situacion_jurica_empresa.entity'

@Injectable()
export class SituacionJuridicaEmpresaRepository {
  constructor(
    @InjectRepository(SituacionJuridicaEmpresa, DB_LGI)
    private readonly repository: Repository<SituacionJuridicaEmpresa>,

    @InjectRepository(PersonasJuridica, DB_LGI)
    private readonly empresaRepository: Repository<PersonasJuridica>,

    @InjectRepository(TipoSituacionJuridica, DB_LGI)
    private readonly tipoRepository: Repository<TipoSituacionJuridica>
  ) {}

  async create(
    dto: CreateSituacionJuridicaEmpresaDto
  ): Promise<SituacionJuridicaEmpresa> {
    await this.verificarEmpresa(dto.idEmpresa)

    await this.verificarTipo(dto.idTipoSituacionJuridica)

    const registro = this.repository.create({
      idEmpresa: dto.idEmpresa,

      fecha: dto.fecha,

      quienAutoriza: dto.quienAutoriza,

      aQuienEntregan: dto.aQuienEntregan,

      idTipoSituacionJuridica: dto.idTipoSituacionJuridica,
    })

    const resultado = await this.repository.save(registro)

    return this.findOne(Number(resultado.idSituacionJuridicaEmpresa))
  }

  async findAll(): Promise<SituacionJuridicaEmpresa[]> {
    return this.repository.find({
      relations: {
        empresa: true,
        tipoSituacionJuridica: true,
      },

      order: {
        fecha: 'DESC',

        idSituacionJuridicaEmpresa: 'DESC',
      },
    })
  }

  async findByEmpresa(idEmpresa: number): Promise<SituacionJuridicaEmpresa[]> {
    await this.verificarEmpresa(idEmpresa)

    return this.repository.find({
      where: {
        idEmpresa,
      },

      relations: {
        tipoSituacionJuridica: true,
      },

      order: {
        fecha: 'DESC',

        idSituacionJuridicaEmpresa: 'DESC',
      },
    })
  }

  async findOne(id: number): Promise<SituacionJuridicaEmpresa> {
    const registro = await this.repository.findOne({
      where: {
        idSituacionJuridicaEmpresa: String(id),
      },

      relations: {
        empresa: true,
        tipoSituacionJuridica: true,
      },
    })

    if (!registro) {
      throw new NotFoundException(
        `No existe la situación jurídica de empresa con ID ${id}`
      )
    }

    return registro
  }

  async update(
    id: number,
    dto: CreateSituacionJuridicaEmpresaDto
  ): Promise<SituacionJuridicaEmpresa> {
    const registro = await this.findOne(id)

    if (dto.idEmpresa !== undefined) {
      await this.verificarEmpresa(dto.idEmpresa)

      registro.idEmpresa = dto.idEmpresa
    }

    if (dto.idTipoSituacionJuridica !== undefined) {
      await this.verificarTipo(dto.idTipoSituacionJuridica)

      registro.idTipoSituacionJuridica = dto.idTipoSituacionJuridica
    }

    if (dto.fecha !== undefined) {
      registro.fecha = dto.fecha
    }

    if (dto.quienAutoriza !== undefined) {
      registro.quienAutoriza = dto.quienAutoriza
    }

    if (dto.aQuienEntregan !== undefined) {
      registro.aQuienEntregan = dto.aQuienEntregan
    }

    await this.repository.save(registro)

    return this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    const registro = await this.findOne(id)

    await this.repository.remove(registro)
  }

  findTipos(): Promise<TipoSituacionJuridica[]> {
    return this.tipoRepository.find({
      order: {
        idTipoSituacionJuridica: 'ASC',
      },
    })
  }

  private async verificarEmpresa(idEmpresa: number): Promise<void> {
    const existe = await this.empresaRepository.exists({
      where: {
        empId: String(idEmpresa),
      },
    })

    if (!existe) {
      throw new NotFoundException(`No existe la empresa con ID ${idEmpresa}`)
    }
  }

  private async verificarTipo(idTipo: number): Promise<void> {
    const existe = await this.tipoRepository.exists({
      where: {
        idTipoSituacionJuridica: String(idTipo),
      },
    })

    if (!existe) {
      throw new NotFoundException(
        `No existe el tipo de situación jurídica con ID ${idTipo}`
      )
    }
  }
}
