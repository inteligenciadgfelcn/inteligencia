import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesionDto } from './dto/create-profesion.dto';
import { UpdateProfesionDto } from './dto/update-profesion.dto';
import { Profesion } from './entities/profesion.entity';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { DB_SII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesionService {
  constructor(
      @InjectRepository(Profesion, DB_SII)
      private readonly profesionRepository: Repository<Profesion>
    ) {}
  
    async create(dto: CreateProfesionDto): Promise<Profesion> {
      const exists = await this.profesionRepository.findOne({
        where: { descripcion: dto.descripcion },
      })
  
      if (exists) {
        throw new BadRequestException(
          'Ya existe profesión con esa descripcion'
        )
      }
  
      const data = this.profesionRepository.create(dto)
      return await this.profesionRepository.save(data)
    }
  
    async findAllPaginado(pagination: PaginacionQueryDto) {
      const { limite, saltar, filtro, sentido } = pagination
  
      const query = this.profesionRepository
        .createQueryBuilder('c')
        .take(limite)
        .skip(saltar)
  
      if (filtro) {
        query.andWhere('c.descripcion ILIKE :filtro', {
          filtro: `%${filtro}%`,
        })
      }
  
      query.orderBy('c.descripcion', sentido === 'DESC' ? 'DESC' : 'ASC')
      return await query.getManyAndCount()
    }
  
    async findAll(): Promise<Profesion[]> {
      return this.profesionRepository.find()
    }
  
    async findOne(id: number): Promise<Profesion> {
      const data = await this.profesionRepository.findOne({
        where: { idProfesion: id },
      })
  
      if (!data) {
        throw new NotFoundException('Profesión no encontrada')
      }
      return data
    }
  
    async update(id: number, dto: UpdateProfesionDto) {
      const data = await this.profesionRepository.findOne({
        where: { idProfesion: id },
      })
  
      if (!data) {
        throw new NotFoundException('Profesión no encontrada')
      }
  
      if (dto.descripcion !== data.descripcion) {
        const exists = await this.profesionRepository.findOne({
          where: { descripcion: dto.descripcion },
        })
  
        if (exists) {
          throw new BadRequestException(
            'Ya existe profesión con esa descripcion'
          )
        }
      }
      Object.assign(data, dto)
      return await this.profesionRepository.save(data)
    }
}
