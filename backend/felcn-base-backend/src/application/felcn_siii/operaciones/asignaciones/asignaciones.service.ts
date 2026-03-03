import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { Asignacion } from './entities/asignacione.entity'

import { CreateAsignacionDto } from './dto/create-asignacione.dto'
import { UpdateAsignacionDto } from './dto/update-asignacione.dto'
import { DB_S2I, DB_SIII } from '@/core/config/database/database.module'
import { Departamento } from '../../parametricas/departamento/entities/departamento.entity'
import { Grupo } from '@/application/felcn_s2i/grupo/entities/grupo.entity'
import { Estado } from '@/application/felcn_s2i/estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion, DB_SIII)
    private readonly repo: Repository<Asignacion>,

    @InjectRepository(Departamento, DB_SIII)
    private readonly departamentoRepo: Repository<Departamento>,

    @InjectRepository(Grupo, DB_S2I)
    private readonly grupoRepo: Repository<Grupo>
  ) {}

  async generarCodigoRegistro(idDepartamento: number, idGrupo: number) {
    const departamento = await this.departamentoRepo.findOne({
      where: { idDepartamento: idDepartamento },
    })

    if (!departamento) {
      throw new BadRequestException('Departamento no válido')
    }

    const grupo = await this.grupoRepo.findOne({
      where: { idGrupo: idGrupo },
      relations: ['distrital', 'distrital.unidad'],
    })

    if (!grupo) {
      throw new BadRequestException('Grupo no válido')
    }

    const yearShort = new Date().getFullYear().toString().slice(-2)

    const count = await this.repo
      .createQueryBuilder('a')
      .where('a.id_departamento_caso = :idDepartamento', {
        idDepartamento,
      })
      .andWhere('a.id_grupo = :idGrupo', {
        idGrupo,
        async generarCodigoRegistro(idDepartamento: number, idGrupo: number) {
          const departamento = await this.departamentoRepo.findOne({
            where: { idDepartamento: idDepartamento },
          })

          if (!departamento) {
            throw new BadRequestException('Departamento no válido')
          }

          const grupo = await this.grupoRepo.findOne({
            where: { idGrupo: idGrupo },
            relations: ['distrital', 'distrital.unidad'],
          })

          if (!grupo) {
            throw new BadRequestException('Grupo no válido')
          }

          const yearShort = new Date().getFullYear().toString().slice(-2)

          const count = await this.repo
            .createQueryBuilder('a')
            .where('a.id_departamento_caso = :idDepartamento', {
              idDepartamento,
            })
            .andWhere('a.id_grupo = :idGrupo', {
              idGrupo,
            })
            .andWhere('a.nro_operativo LIKE :year', {
              year: `%/${yearShort}`,
            })
            .getCount()

          const correlativo = count + 1

          return `${departamento.abreviatura}-${grupo.distrital.unidad.abreviatura}-${correlativo}/${yearShort}`
        },
      })
      .andWhere('a.nro_operativo LIKE :year', {
        year: `%/${yearShort}`,
      })
      .getCount()

    const correlativo = count + 1

    return `${departamento.abreviatura}-${grupo.distrital.unidad.abreviatura}-${correlativo}/${yearShort}`
  }

  async create(dto: CreateAsignacionDto): Promise<Asignacion> {
    const departamento = await this.departamentoRepo.findOne({
      where: { idDepartamento: dto.idDepartamento },
    })

    if (!departamento) {
      throw new BadRequestException('Departamento no válido')
    }

    const grupo = await this.grupoRepo.findOne({
      where: { idGrupo: dto.idGrupo },
    })

    if (!grupo) {
      throw new BadRequestException('Grupo no válido')
    }

    const nroOperativo = await this.generarCodigoRegistro(
      dto.idDepartamento,
      dto.idGrupo
    )

    const asignacion = this.repo.create({
      departamento,
      idGrupo: dto.idGrupo,
      nroOperativo,
      codigoServicio: 'SERV-001',
      nombreCaso: dto.nombreCaso,
      fechaSolicitud: dto.fechaSolicitud,
      nombreSolicitud: dto.nombreSolicitud,
      telefonoSolicitud: dto.telefonoSolicitud,
      asignado: dto.asignado,
      telefonoAsignado: dto.telefonoAsignado,
      fiscalAsignado: dto.fiscalAsignado,
      telefonoFiscal: dto.telefonoFiscal,
    })

    return await this.repo.save(asignacion)
  }

  async findByCodigoResumen(nroOperativo: string) {
    const asignacion = await this.repo
      .createQueryBuilder('a')
      .leftJoin('a.departamento', 'd')
      .leftJoin('a.grupo', 'g')
      .leftJoin('g.distrital', 'dis')
      .leftJoin('dis.unidad', 'u')
      .select([
        'a.id AS id',
        'a.nroOperativo AS nroOperativo',
        'a.nombreCaso AS nombreCaso',
        'a.telefonoSolicitud AS telefonoSolicitud',
        'a.asignado AS asignado',
        'a.telefonoAsignado AS telefonoAsignado',
        'a.fiscalAsignado AS fiscalAsignado',
        'a.telefonoFiscal AS telefonoFiscal',
        'd.nombre AS departamento',
        'g.descripcion AS grupo',
        'dis.descripcion AS distrito',
        'u.descripcion AS unidad',
      ])
      .where('a.nro_operativo = :nroOperativo', { nroOperativo })
      .getRawOne()

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontró asignación con código ${nroOperativo}`
      )
    }

    return asignacion
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    const asignacion = await this.repo.findOne({
      where: { idAsignacion: id },
    })

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }

    Object.assign(asignacion, dto)

    return this.repo.save(asignacion)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro, sentido } = pagination

    const query = this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.departamento', 'd')
      .leftJoinAndSelect('a.grupo', 'g')
      .leftJoinAndSelect('g.distrital', 'dis')
      .leftJoinAndSelect('dis.unidad', 'u')
      .select([
        'a.id',
        'a.estado',
        'a.nroOperativo',
        'a.fechaSolicitud',
        'a.nombreCaso',
        'a.asignado',
        'a.fiscalAsignado',
        'd.id',
        'd.nombre',
        'g.id',
        'dis.id',
        'u.id',
        'u.descripcion',
      ])
      .where('a.estado = :estado', {
        estado: Estado.ACTIVO,
      })
      .take(limite)
      .skip(saltar)

    if (filtro) {
      query.andWhere('a.nombreCaso ILIKE :filtro', {
        filtro: `%${filtro}%`,
      })
    }
    return await query.getManyAndCount()
  }
}
