import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DB_SIII } from '@/core/config/database/database.module'
import { Repository } from 'typeorm'
import { Usuario } from './entities/usuario.entity'
import { Estado } from '../../estado.enum'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario, DB_SIII)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAllPaginado(pagination: PaginacionQueryDto){
    const {filtro} = pagination
    const query = this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.grado', 'grado')
      .leftJoinAndSelect('usuario.grupo', 'grupo')
      .where('usuario.estado = :estado', {
        estado: Estado.ACTIVO,
      })

    if (filtro) {
      query.andWhere(
        '(usuario.nombre_app ILIKE :filtro OR usuario.usuario ILIKE :filtro)',
        { filtro: `%${filtro}%` }
      )
    }
    return await query.getManyAndCount()
  }

  async findAllActivos() {
    return this.usuarioRepository.find({
      where: { estado: Estado.ACTIVO },
      relations: ['grado', 'grupo', 'grupo.unidad']
    })
  }

  async findByGrupo(grupoId: number) {
    return this.usuarioRepository.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: { idGrupo: grupoId },
      },
      relations: ['grado', 'grupo'],
    })
  }

  async findByDistrito(disId: number) {
    return this.usuarioRepository.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: {
          distrital: {
            idDistrital: disId,
          },
        },
      },
      relations: ['grado', 'grupo', 'grupo.distrital']
    })
  }

  async findByUnidad(unidadId: number) {
    return this.usuarioRepository.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: {
          distrital: {
            unidad: {
              idUnidad: unidadId,
            },
          },
        },
      },
      relations: [
        'grado',
        'grupo',
        'grupo.distrital',
        'grupo.distrital.unidad',
      ]
    })
  }

  async findByUnidadInteligencia() {
    return this.usuarioRepository.find({
      where: {
        estado: Estado.ACTIVO,
        grupo: {
          distrital: {
            unidad: {
              idUnidad: 22,
            },
          },
        },
      },
      relations: [
        'grado',
        'grupo',
        'grupo.distrital',
        'grupo.distrital.unidad',
      ]
    })
  }

  async findOne(idUsuario: string){
    const user = await this.usuarioRepository.findOne({
      where: { usuario: idUsuario },
      relations: ['grado', 'grupo'],
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return user
  }
}
