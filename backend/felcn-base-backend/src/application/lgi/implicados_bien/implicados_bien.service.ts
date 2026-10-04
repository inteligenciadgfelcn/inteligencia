import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateImplicadosBienDto } from './dto/create-implicados_bien.dto';
import { UpdateImplicadosBienDto } from './dto/update-implicados_bien.dto';
import { ImplicadosBienLgiRepository } from './repository/implicado-bien-lgi.repository';
import { REQUEST } from '@nestjs/core/router/request';
import { ImplicadosBien } from './entities/implicados_bien.entity';

interface RequestConAuditoria extends Request {
  usuarioAuditoria?: string
}
@Injectable()
export class ImplicadosBienService {
   constructor(
      private readonly repository: ImplicadosBienLgiRepository,
      @Inject(REQUEST)
      private readonly request: RequestConAuditoria
    ) {}
   private obtenerUsuarioAuditoria(): string {
      const usuario = this.request.usuarioAuditoria?.trim()
  
      if (!usuario) {
        throw new UnauthorizedException(
          'No se encontró el usuario para registrar la auditoría'
        )
      }
  
      return usuario
    }
  
    private validarId(id: string): void {
      if (!/^[1-9]\d*$/.test(id)) {
        throw new BadRequestException('El ID debe ser un entero positivo')
      }
    }
  
    async create(dto: CreateImplicadosBienDto): Promise<ImplicadosBien> {
      return this.repository.create(dto, this.obtenerUsuarioAuditoria())
    }
  
    async findAll(
      id_operativo?: string,
      idItemBien?: number
    ): Promise<ImplicadosBien[]> {
      if (id_operativo !== undefined) {
        this.validarId(id_operativo)
      }
  
      if (
        idItemBien !== undefined &&
        (!Number.isInteger(idItemBien) || idItemBien <= 0 || idItemBien > 2147483647)
      ) {
        throw new BadRequestException(
          'idItemBien debe ser un entero positivo válido'
        )
      }
  
      return this.repository.findAll(id_operativo, idItemBien)
    }
  
    async findOne(id: string): Promise<ImplicadosBien> {
      this.validarId(id)
  
      const implicado = await this.repository.findOne(id)
  
      if (!implicado) {
        throw new NotFoundException(
          `El implicado con ID ${id} no existe o está inactivo`
        )
      }
  
      return implicado
    }
  
    async findByOperativo(operativoId: string): Promise<ImplicadosBien[]> {
      this.validarId(operativoId)
  
      return this.repository.findByOperativo(operativoId)
    }
  
    async update(id: string, dto: UpdateImplicadosBienDto): Promise<ImplicadosBien> {
      this.validarId(id)
  
      const implicado = await this.repository.update(
        id,
        dto,
        this.obtenerUsuarioAuditoria()
      )
  
      if (!implicado) {
        throw new NotFoundException(
          `El implicado con ID ${id} no existe o está inactivo`
        )
      }
  
      return implicado
    }
  
    async remove(id: string): Promise<{ message: string }> {
      this.validarId(id)
  
      const eliminado = await this.repository.remove(
        id,
        this.obtenerUsuarioAuditoria()
      )
  
      if (!eliminado) {
        throw new NotFoundException(
          `El implicado con ID ${id} no existe o ya está inactivo`
        )
      }
  
      return {
        message: 'Implicado dado de baja correctamente',
      }
    }
}
