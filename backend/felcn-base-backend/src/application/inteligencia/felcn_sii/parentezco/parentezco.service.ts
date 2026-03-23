import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParentezcoDto } from './dto/create-parentezco.dto';
import { UpdateParentezcoDto } from './dto/update-parentezco.dto';
import { Parentezco } from './entities/parentezco.entity';
import { DB_SII } from '@/core/config/database/database.module';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';
import { Repository } from 'typeorm';
import { Estado } from '../../felcn_siii/estado.enum';

@Injectable()
export class ParentezcoService {
   @InjectRepository(Parentezco, DB_SII)
        private readonly parentezcoRepository: Repository<Parentezco>
  

    async create(dto: CreateParentezcoDto): Promise<Parentezco> {
      const exists = await this.parentezcoRepository.findOne({
        where: { descripcion: dto.descripcion },
      })
  
      if (exists) {
        throw new BadRequestException('Ya existe un Parentezco con ese código')
      }
  
      const parentezco = this.parentezcoRepository.create({
        ...dto,
      })
  
      return await this.parentezcoRepository.save(parentezco)
    }
  
    async findAllGeneral(): Promise<Parentezco[]> {
      return await this.parentezcoRepository.find({
        where: {
          estado: Estado.ACTIVO,
        },
      })
    }
  
    async findAll(pagination: PaginacionQueryDto) {
      const { limite, saltar, filtro, sentido } = pagination
      const query = this.parentezcoRepository
        .createQueryBuilder('p')
        .where('p.estado = :estado', { estado: Estado.ACTIVO })
        .take(limite)
        .skip(saltar)
      if (filtro) {
        query.andWhere('p.descripcion ILIKE :filtro', {
          filtro: `%${filtro}%`,
        })
      }

      return await query.getManyAndCount()
    }
  
    async findOne(id: number): Promise<Parentezco> {
      const parentezco = await this.parentezcoRepository.findOne({
        where: { idParentezco: id },
      })
  
      if (!parentezco) {
        throw new NotFoundException('Parentezco no encontrado')
      }
  
      return parentezco
    }
  
    async update(id: number, dto: UpdateParentezcoDto): Promise<Parentezco> {
      const parentezco = await this.parentezcoRepository.findOne({
        where: { idParentezco: id, estado: Estado.ACTIVO },
      })
  
      if (!parentezco) {
        throw new NotFoundException('Parentezco no encontrado')
      }
  
      // Validar código único si lo están actualizando
      if (dto.descripcion && dto.descripcion !== parentezco.descripcion) {
        const exists = await this.parentezcoRepository.findOne({
          where: { descripcion: dto.descripcion },
        })
  
        if (exists) {
          throw new BadRequestException('Ya existe un Parentezco con esa descripcion')
        }
      }
  
      return await this.parentezcoRepository.save(parentezco)
    }
  
    async remove(id: number): Promise<Parentezco> {
      const parentezco = await this.parentezcoRepository.findOne({
        where: {
          idParentezco: id,
          estado: Estado.ACTIVO,
        },
      })
  
      if (!parentezco) {
        throw new NotFoundException('Parentezco no encontrado')
      }
  
      parentezco.estado = Estado.INACTIVO
  
      return await this.parentezcoRepository.save(parentezco)
    }
}
