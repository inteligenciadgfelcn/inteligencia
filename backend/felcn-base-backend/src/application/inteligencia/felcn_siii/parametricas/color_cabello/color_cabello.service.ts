import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorCabelloDto } from './dto/create-color_cabello.dto';
import { UpdateColorCabelloDto } from './dto/update-color_cabello.dto';
import { ColorCabello } from './entities/color_cabello.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_SIII } from '@/core/config/database/database.module';
import { Repository } from 'typeorm';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';

@Injectable()
export class ColorCabelloService {

  constructor(
      @InjectRepository(ColorCabello, DB_SIII)
      private readonly colorCabelloRepository: Repository<ColorCabello>,
    ) {}

  async create(dto: CreateColorCabelloDto): Promise<ColorCabello> {
      const exists = await this.colorCabelloRepository.findOne({
        where: { descripcion: dto.descripcion },
      })
  
      if (exists) {
        throw new BadRequestException('Ya existe un color de cabbello son esa descripcion')
      }
  
      const data = this.colorCabelloRepository.create(dto)
      return await this.colorCabelloRepository.save(data)
    }
  
    async findAllPaginado(pagination: PaginacionQueryDto) {
      const { limite, saltar, filtro, sentido } = pagination
  
      const query = this.colorCabelloRepository
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
  
    async findAll(): Promise<ColorCabello[]> {
      return this.colorCabelloRepository.find();
    }
  
    async findOne(id: number): Promise<ColorCabello> {
      const data = await this.colorCabelloRepository
        .findOne({
          where: { idColorCabello: id},
        })
  
      if (!data) {
        throw new NotFoundException('Color de cabello no encontrada')
      }
      return data;
    }
  
    async update(id: number, dto: UpdateColorCabelloDto) {
      const data = await this.colorCabelloRepository.findOne({
        where: { idColorCabello: id },
      })
  
      if (!data) {
        throw new NotFoundException('color de cabello no encontrada')
      }
  
      if (dto.descripcion  !== data.descripcion) {
        const exists = await this.colorCabelloRepository.findOne({
          where: { descripcion: dto.descripcion },
        })
  
        if (exists) {
          throw new BadRequestException('Ya existe un color de cabello con esa descripcion')
        }
      }
      Object.assign(data, dto)
      return await this.colorCabelloRepository.save(data)
    }
}
