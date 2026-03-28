import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Asignacion } from './entities/asignacione.entity';

import { Departamento } from 'src/modules/parametros/departamentos/entities/departamento.entity';
import { Grupo } from 'src/modules/usuario/grupos/entities/grupo.entity';
import { Letra } from 'src/modules/parametros/letras/entities/letra.entity';

import { Estado } from 'src/common/enums/estado.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { CreateAsignacionDto } from './dto/create-asignacione.dto';
import { UpdateAsignacionDto } from './dto/update-asignacione.dto';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly repo: Repository<Asignacion>,

    @InjectRepository(Departamento)
    private readonly departamentoRepo: Repository<Departamento>,

    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,

    @InjectRepository(Letra)
    private readonly letraRepo: Repository<Letra>,
  ) {}

  async generarCodigoRegistro(idDepartamento: number, idGrupo: number) {
    const departamento = await this.departamentoRepo.findOne({
      where: { id: idDepartamento },
      select: ['id', 'codigo'],
    });

    if (!departamento) {
      throw new BadRequestException('Departamento no válido');
    }

    const grupo = await this.grupoRepo.findOne({
      where: { id: idGrupo },
      relations: ['distrital', 'distrital.unidad'],
    });

    if (!grupo) {
      throw new BadRequestException('Grupo no válido');
    }

    const yearShort = new Date().getFullYear().toString().slice(-2);

    const count = await this.repo
      .createQueryBuilder('a')
      .where('a.id_departamento = :idDepartamento', {
        idDepartamento,
      })
      .andWhere('a.id_grupo = :idGrupo', {
        idGrupo,
      })
      .andWhere('a.nro_operativo LIKE :year', {
        year: `%/${yearShort}`,
      })
      .getCount();

    const correlativo = count + 1;

    return `${departamento.codigo}-${grupo.distrital.unidad.codigo}-${correlativo}/${yearShort}`;
  }

  async create(dto: CreateAsignacionDto): Promise<Asignacion> {
    const departamento = await this.departamentoRepo.findOne({
      where: { id: dto.idDepartamento },
    });

    if (!departamento) {
      throw new BadRequestException('Departamento no válido');
    }

    const grupo = await this.grupoRepo.findOne({
      where: { id: dto.idGrupo },
    });

    if (!grupo) {
      throw new BadRequestException('Grupo no válido');
    }

    const nroOperativo = await this.generarCodigoRegistro(
      dto.idDepartamento,
      dto.idGrupo,
    );

    const asignacion = this.repo.create({
      departamento,
      grupo,
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
    });

    return await this.repo.save(asignacion);
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
      .getRawOne();

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontró asignación con código ${nroOperativo}`,
      );
    }

    return asignacion;
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    const asignacion = await this.repo.findOne({
      where: { id },
    });

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada');
    }

    Object.assign(asignacion, dto);

    return this.repo.save(asignacion);
  }

  async findAllPaginado(pagination: PaginationQueryDto) {
    const qb = this.repo
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
      });

    const result = await qb.getMany();
    console.log(result);
    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: [
        'a.nroOperativo',
        'a.nombreCaso',
        'a.asignado',
        'a.fiscalAsignado',
      ],
      sortableColumns: ['a.id', 'a.fechaSolicitud', 'a.nroOperativo'],
    });
  }
}
