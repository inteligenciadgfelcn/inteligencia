import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { User } from './entities/user.entity';
import { Grado } from '../grados/entities/grado.entity';
import { Grupo } from '../grupos/entities/grupo.entity';

import { Estado } from 'src/common/enums/estado.enum';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';

import { UsuarioExternoService } from './user-externo.service';
import { CreateUsuarioCompletoDto } from './dto/create-user-completo.dto';
import { UpdateUsuarioCompletoDto } from './dto/update-user-completo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Grado) private readonly gradoRepo: Repository<Grado>,
    @InjectRepository(Grupo) private readonly grupoRepo: Repository<Grupo>,
    private readonly usuarioExternoService: UsuarioExternoService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateUsuarioCompletoDto, token: string): Promise<User> {
  const exists = await this.repo.findOne({
    where: { nroPase: dto.nroPase },
  });

  if (exists) {
    throw new BadRequestException(
      'Ya existe un usuario con ese número de pase',
    );
  }

  const grado = await this.getGradoOrFail(dto.idGrado);
  const grupo = await this.getGrupoOrFail(dto.idGrupo);

  const bodyExterno = {
    correoElectronico: dto.correoElectronico,
    persona: {
      nroDocumento: dto.nroDocumento,
      tipoDocumento: dto.tipoDocumento,
      nombres: dto.nombres,
      primerApellido: dto.primerApellido,
      segundoApellido: dto.segundoApellido,
      fechaNacimiento: dto.fechaNacimiento,
      telefono: dto.telefono,
    },
    roles: Array.isArray(dto.roles)
      ? dto.roles.map((r) => String(r))
      : [String(dto.roles)],
  };

  const usuarioCreado =
    await this.usuarioExternoService.crearUsuarioExterno(
      bodyExterno,
      token,
    );

  const user = this.repo.create({
    ...dto,
    idUsuario: Number(usuarioCreado.datos.id),
    grado,
    grupo,
  });

  return this.repo.save(user);
}

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginationResult<User>> {
    const qb = this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.grado', 'grado')
      .leftJoinAndSelect('user.grupo', 'grupo')
      .where('user.estado = :estado', {
        estado: Estado.ACTIVO,
      });

    return paginateQueryBuilder(qb, pagination, {
      searchableColumns: ['user.nroPase', 'grado.descripcion'],
      sortableColumns: ['user.id', 'user.nroPase'],
    });
  }

  async findAllActivos(): Promise<User[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['grado', 'grupo'],
      order: { id: 'ASC' },
    });
  }

  async findByGrupo(grupoId: number): Promise<User[]> {
    return this.repo.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: { id: grupoId },
      },
      relations: ['grado', 'grupo'],
    });
  }

  async findByDistrito(disId: number): Promise<User[]> {
    return this.repo.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: {
          distrital: {
            id: disId,
          },
        },
      },
      relations: ['grado', 'grupo', 'grupo.distrital'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findByUnidad(unidadId: number): Promise<User[]> {
    return this.repo.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: {
          distrital: {
            unidad: {
              id: unidadId,
            },
          },
        },
      },
      relations: [
        'grado',
        'grupo',
        'grupo.distrital',
        'grupo.distrital.unidad',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(idUsuario: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { idUsuario },
      relations: ['grado', 'grupo'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

async update(idUsuario: number, dto: UpdateUsuarioCompletoDto, token: string): Promise<User> {
  const user = await this.repo.findOne({
    where: { idUsuario, estado: Estado.ACTIVO },
    relations: ['grado', 'grupo'],
  });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const bodyExterno: any = {};

  if (dto.nroPase && dto.nroPase !== user.nroPase) {
    const exists = await this.repo.findOne({
      where: { nroPase: dto.nroPase },
    });

    if (exists && exists.id !== user.id) {
      throw new BadRequestException(
        'Ya existe un usuario con ese número de pase',
      );
    }

    user.nroPase = dto.nroPase;
  }

  if (
    dto.persona?.correoElectronico &&
    dto.persona.correoElectronico !== user.correoElectronico
  ) {
    const exists = await this.repo.findOne({
      where: { correoElectronico: dto.persona.correoElectronico },
    });

    if (exists && exists.id !== user.id) {
      throw new BadRequestException(
        'Ya existe un usuario con ese correo',
      );
    }

    user.correoElectronico = dto.persona.correoElectronico;
  }

  if (dto.persona) {
    const personaUpdate: any = {};

    this.setIfChanged(personaUpdate,'nroDocumento',dto.persona.nroDocumento,user.nroDocumento);
    this.setIfChanged(personaUpdate,'tipoDocumento',dto.persona.tipoDocumento,user.tipoDocumento);
    this.setIfChanged(personaUpdate,'nombres',dto.persona.nombres,user.nombres);
    this.setIfChanged(personaUpdate,'primerApellido',dto.persona.primerApellido,user.primerApellido);
    this.setIfChanged(personaUpdate,'segundoApellido',dto.persona.segundoApellido,user.segundoApellido);
    this.setIfChanged(personaUpdate, 'telefono', dto.persona.telefono,user.telefono);

    if (dto.persona.fechaNacimiento !== undefined) {
      personaUpdate.fechaNacimiento = dto.persona.fechaNacimiento;
    }

    if (Object.keys(personaUpdate).length > 0) {
      bodyExterno.persona = personaUpdate;
    }
  }

  if (dto.roles) {
    bodyExterno.roles = Array.isArray(dto.roles)
      ? dto.roles.map((r) => String(r))
      : [String(dto.roles)];
  }

  if (Object.keys(bodyExterno).length > 0) {
    await this.usuarioExternoService.actualizarUsuarioExterno(
      user.idUsuario,
      bodyExterno,
      token,
    );
  }

  if (dto.telefonoCorporativo !== undefined) {
    user.telefonoCorporativo = dto.telefonoCorporativo;
  }

  if (dto.idGrado) {
    user.grado = await this.getGradoOrFail(dto.idGrado);
  }

  if (dto.idGrupo) {
    user.grupo = await this.getGrupoOrFail(dto.idGrupo);
  }

  return this.repo.save(user);
}

  async inactivarUsuario(idUsuario: number, token: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { idUsuario, estado: Estado.ACTIVO },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado o ya inactivo');
      }

      await this.usuarioExternoService.desactivarUsuarioExterno(
        user.idUsuario,
        token,
      );

      user.estado = Estado.INACTIVO;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async activarUsuario(idUsuario: number, token: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { idUsuario, estado: Estado.INACTIVO },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado o ya activo');
      }

      await this.usuarioExternoService.activarUsuarioExterno(
        user.idUsuario,
        token,
      );

      user.estado = Estado.ACTIVO;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /* Helpers privados */
  private async getGradoOrFail(id: number) {
    const grado = await this.gradoRepo.findOne({ where: { id } });
    if (!grado) throw new BadRequestException('Grado no existe');
    return grado;
  }

  private async getGrupoOrFail(id: number) {
    const grupo = await this.grupoRepo.findOne({ where: { id } });
    if (!grupo) throw new BadRequestException('Grupo no existe');
    return grupo;
  }

  private setIfChanged<T>(
  target: Partial<T>,
  key: keyof T,
  newValue: any,
  oldValue: any,
): void {
  if (
    newValue !== undefined &&
    newValue !== null &&
    newValue !== '' &&
    newValue !== oldValue
  ) {
    target[key] = newValue;
  }
}
}
