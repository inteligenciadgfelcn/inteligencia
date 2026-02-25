import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';
import { Estado } from 'src/common/enums/estado.enum';
import { paginateQueryBuilder } from 'src/common/helpers/paginate.helper';
import { UsuarioExternoService } from './user-externo.service';
import { CreateUsuarioCompletoDto } from './dto/create-user-completo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,

    private readonly usuarioExternoService: UsuarioExternoService,
  ) {}

  async create(
    dto: CreateUsuarioCompletoDto,
    token: string,
  ): Promise<User> {

    const exists = await this.repo.findOne({
      where: { nroPase: dto.nroPase },
    });

    if (exists) {
      throw new BadRequestException(
        'Ya existe un usuario con ese número de pase',
      );
    }

    // 🔹 Construir body para servicio externo
    const bodyExterno = {
      correoElectronico: dto.correo,
      persona: {
        nroDocumento: dto.nroDocumento,
        tipoDocumento: dto.tipoDocumento,
        nombres: dto.nombre,
        primerApellido: dto.primerApellido,
        segundoApellido: dto.segundoApellido,
        fechaNacimiento: dto.fechaNacimiento,
        telefono: dto.telefono,
        uuidCiudadano: '',
      },
      roles: dto.roles,
    };

    await this.usuarioExternoService.crearUsuarioExterno(
      bodyExterno,
      token,
    );

    const user = this.repo.create({
      nroPase: dto.nroPase,
      telefonoCorporativo: dto.telefonoCorporativo,
    });

    return await this.repo.save(user);
  }

  // 🔹 LISTADO PAGINADO
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
      searchableColumns: [
        'user.nroPase',
        'grado.descripcion',
      ],
      sortableColumns: [
        'user.id',
        'user.nroPase',
        'user.fechaCreacion',
      ],
    });
  }

  // 🔹 LISTA SIMPLE
  async findAllActivos(): Promise<User[]> {
    return this.repo.find({
      where: { estado: Estado.ACTIVO },
      relations: ['grado', 'grupo'],
      order: { id: 'ASC' },
    });
  }

  // 🔹 BUSCAR POR ID
  async findOne(id: number): Promise<User> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['grado', 'grupo'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  // 🔹 ACTUALIZAR
  async update(id: number, dto: UpdateUserDto): Promise<User> {

    const user = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user, dto);

    return await this.repo.save(user);
  }

  // 🔹 ELIMINACIÓN LÓGICA
  async remove(id: number): Promise<void> {

    const user = await this.repo.findOne({
      where: {
        id,
        estado: Estado.ACTIVO,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.estado = Estado.INACTIVO;

    await this.repo.save(user);
  }
}