import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { UsuarioExternoService } from './user-externo.service';
import { CreateUsuarioCompletoDto } from './dto/create-user-completo.dto';
import { Grado } from '../grados/entities/grado.entity';
import { Grupo } from '../grupos/entities/grupo.entity';
import { UpdateUsuarioCompletoDto } from './dto/update-user-completo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,

    @InjectRepository(Grado)
    private readonly gradoRepo: Repository<Grado>,

    @InjectRepository(Grupo)
    private readonly grupoRepo: Repository<Grupo>,

    private readonly usuarioExternoService: UsuarioExternoService,
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

    const grado = await this.gradoRepo.findOne({
      where: { id: dto.idGrado },
    });

    if (!grado) throw new BadRequestException('Grado no existe');

    const grupo = await this.grupoRepo.findOne({
      where: { id: dto.idGrupo },
    });

    if (!grupo) throw new BadRequestException('Grupo no existe');

    const usuarioCreado = await this.usuarioExternoService.crearUsuarioExterno(
      bodyExterno,
      token,
    );

    const user = this.repo.create({
      nroPase: dto.nroPase,
      telefonoCorporativo: dto.telefonoCorporativo,
      idUsuario: Number(usuarioCreado.datos.id),
      grado: { id: dto.idGrado },
      grupo: { id: dto.idGrupo },
      correoElectronico: dto.correoElectronico,
      nroDocumento: dto.nroDocumento,
      tipoDocumento: dto.tipoDocumento,
      nombres: dto.nombres,
      primerApellido: dto.primerApellido,
      segundoApellido: dto.segundoApellido,
      telefono: dto.telefono,
    });

    return await this.repo.save(user);
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
      sortableColumns: ['user.id', 'user.nroPase', 'user.fechaCreacion'],
    });
  }

  async findAllActivos(): Promise<User[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['grado', 'grupo'],
      order: { id: 'ASC' },
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

  async update(
    idUsuario: number,
    dto: UpdateUsuarioCompletoDto,
    token: string,
  ): Promise<User> {
    const user = await this.repo.findOne({
      where: {
        idUsuario,
        estado: Estado.ACTIVO,
      },
      relations: ['grado', 'grupo'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const bodyExterno: any = {};

    try {
      // Construcción body externo

      if (dto.persona) {
        const personaUpdate: any = {};

        const {
          nroDocumento,
          tipoDocumento,
          nombres,
          primerApellido,
          segundoApellido,
          telefono,
          fechaNacimiento,
        } = dto.persona;

        this.setIfChanged(personaUpdate, 'nroDocumento', nroDocumento,user.nroDocumento);
        this.setIfChanged(personaUpdate,'tipoDocumento',tipoDocumento,user.tipoDocumento);
        this.setIfChanged(personaUpdate, 'nombres', nombres, user.nombres);
        this.setIfChanged(personaUpdate,'primerApellido',primerApellido,user.primerApellido);
        this.setIfChanged(personaUpdate,'segundoApellido',segundoApellido,user.segundoApellido);
        this.setIfChanged(personaUpdate, 'telefono', telefono, user.telefono);

        if (fechaNacimiento !== undefined) {
          personaUpdate.fechaNacimiento = fechaNacimiento;
        }

        if (Object.keys(personaUpdate).length > 0) {
          bodyExterno.persona = personaUpdate;
        }
      }

      if (
        dto.persona?.correoElectronico !== undefined &&
        dto.persona.correoElectronico !== user.correoElectronico
      ) {
        bodyExterno.correoElectronico = dto.persona.correoElectronico;
      }

      if (dto.roles) {
        bodyExterno.roles = Array.isArray(dto.roles)
          ? dto.roles.map((r) => String(r))
          : [String(dto.roles)];
      }

      // Actualizar servicio externo

      if (Object.keys(bodyExterno).length > 0) {
        const respuestaUser =
          await this.usuarioExternoService.actualizarUsuarioExterno(
            user.idUsuario,
            bodyExterno,
            token,
          );

        if (!respuestaUser?.finalizado) {
          throw new BadRequestException(
            'No se pudo actualizar usuario en USER',
          );
        }
      }

      // Actualizar entidad local

      if (dto.persona) {
        Object.assign(user, {
          nroDocumento: dto.persona.nroDocumento ?? user.nroDocumento,
          tipoDocumento: dto.persona.tipoDocumento ?? user.tipoDocumento,
          nombres: dto.persona.nombres ?? user.nombres,
          primerApellido: dto.persona.primerApellido ?? user.primerApellido,
          segundoApellido: dto.persona.segundoApellido ?? user.segundoApellido,
          telefono: dto.persona.telefono ?? user.telefono,
        });
      }

      if (dto.persona?.correoElectronico !== undefined) {
        user.correoElectronico = dto.persona.correoElectronico;
      }

      if (dto.telefonoCorporativo !== undefined) {
        user.telefonoCorporativo = dto.telefonoCorporativo;
      }

      if (dto.idGrado) {
        const grado = await this.gradoRepo.findOne({
          where: { id: dto.idGrado },
        });

        if (!grado) throw new BadRequestException('Grado no existe');
        user.grado = grado;
      }

      if (dto.idGrupo) {
        const grupo = await this.grupoRepo.findOne({
          where: { id: dto.idGrupo },
        });

        if (!grupo) throw new BadRequestException('Grupo no existe');
        user.grupo = grupo;
      }

      return await this.repo.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error?.response) {
        const status = error.response.status || 500;
        const message =
          error.response.data?.message ||
          error.response.data ||
          'Error recibido desde el servicio USER';

        throw new HttpException(message, status);
      }

      if (error?.request) {
        throw new HttpException(
          'No se pudo conectar con el servicio USER',
          503,
        );
      }

      throw new HttpException(
        error?.message || 'Error inesperado al actualizar usuario',
        500,
      );
    }
  }
  private setIfChanged<T>(
    target: Partial<T>,
    key: keyof T,
    newValue: any,
    oldValue: any,
  ) {
    if (newValue !== undefined && newValue !== oldValue) {
      target[key] = newValue;
    }
  }
}
