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
import { Estado } from '@/application/felcn_siii/estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { Grupo } from '../../parametricas/grupo/entities/grupo.entity'

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion, DB_SIII)
    private readonly asignacionRepository: Repository<Asignacion>,

    @InjectRepository(Departamento, DB_SIII)
    private readonly departamentoRepository: Repository<Departamento>,

    @InjectRepository(Grupo, DB_SIII)
    private readonly grupoRepository: Repository<Grupo>
  ) {}

  async generarCodigoRegistro(idDepartamento: number, idGrupo: number) {
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento },
    })

    if (!departamento) {
      throw new BadRequestException('Departamento no válido')
    }

    const grupo = await this.grupoRepository.findOne({
      where: { idGrupo },
      relations: ['distrital', 'distrital.unidad'],
    })

    if (!grupo) {
      throw new BadRequestException('Grupo no válido')
    }

    const yearShort = new Date().getFullYear().toString().slice(-2)

    const count = await this.asignacionRepository
      .createQueryBuilder('a')
      .where('a.abreviatura_departamento = :abreviatura', {
        abreviatura: departamento.abreviatura,
      })
      .andWhere('a.id_grupo = :idGrupo', {
        idGrupo,
      })
      .andWhere('a.numero_operativo LIKE :year', {
        year: `%/${yearShort}`,
      })
      .getCount()

    const correlativo = count + 1

    return `${departamento.abreviatura}-${grupo.distrital.unidad.abreviatura}-${correlativo}/${yearShort}`
  }

  async create(dto: CreateAsignacionDto): Promise<Asignacion> {
    const departamento = await this.departamentoRepository.findOne({
      where: { idDepartamento: dto.idDepartamento },
    })

    if (!departamento) {
      throw new BadRequestException('Departamento no válido')
    }

    const grupo = await this.grupoRepository.findOne({
      where: { idGrupo: dto.idGrupo },
      relations: ['distrital', 'distrital.unidad'],
    })

    if (!grupo) {
      throw new BadRequestException('Grupo no válido')
    }

    const nroOperativo = await this.generarCodigoRegistro(
      dto.idDepartamento,
      dto.idGrupo
    )

    const asignacion = this.asignacionRepository.create({
      departamento: departamento,
      grupo: grupo,
      distrital: grupo.distrital,
      unidad: grupo.distrital.unidad,
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

    return await this.asignacionRepository.save(asignacion)
  }

  async findByCodigoResumen(nroOperativo: string) {
    const asignacion = await this.asignacionRepository
      .createQueryBuilder('a')
      .leftJoin('a.departamento', 'd')
      .leftJoin('a.grupo', 'g')
      .leftJoin('g.distrital', 'dis')
      .leftJoin('dis.unidad', 'u')
      .select([
        'a.id_caso AS id',
        'a.numero_operativo AS nroOperativo',
        'a.nombre_caso AS nombreCaso',
        'a.telefono_solicitud AS telefonoSolicitud',
        'a.asignado_caso AS asignado',
        'a.telefono_asignado AS telefonoAsignado',
        'a.fiscal_asignado_caso AS fiscalAsignado',
        'a.telefono_fiscal AS telefonoFiscal',
        'd.descripcion AS departamento',
        'g.descripcion AS grupo',
        'dis.descripcion AS distrito',
        'u.descripcion AS unidad',
      ])
      .where('a.numero_operativo = :nroOperativo', { nroOperativo })
      .getRawOne()

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontró asignación con código ${nroOperativo}`
      )
    }

    return asignacion
  }
  async update(id: number, dto: UpdateAsignacionDto) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { idAsignacion: id },
    })
    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }
    Object.assign(asignacion, dto)
    return this.asignacionRepository.save(asignacion)
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    const { limite, saltar, filtro } = pagination
    const query = this.asignacionRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.departamento', 'd')
      .leftJoinAndSelect('a.grupo', 'g')
      .leftJoinAndSelect('g.distrital', 'dis')
      .leftJoinAndSelect('dis.unidad', 'u')
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
