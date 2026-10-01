import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonasImplicadasPdDto } from './dto/create-personas_implicadas_pd.dto';
import { UpdatePersonasImplicadasPdDto } from './dto/update-personas_implicadas_pd.dto';
import { PersonasImplicadasPdRepository } from './repository/personas_implicadas.repository';
import { DeletePersonasImplicadaDto } from '@/application/lgi/personas_implicadas/dto/delete-personas_implicadas.dto';
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity';
import { PaginacionQueryDto } from '@/common/dto';

@Injectable()
export class PersonasImplicadasPdService {
 constructor(private readonly repository: PersonasImplicadasPdRepository) {}
 
   async registrarPersona(dto: CreatePersonasImplicadasPdDto): Promise<{
     message: string
     id: number
   }> {
     const detenido = await this.repository.registrarPersona(dto)
 
     return {
       message: 'Registro de implicado exitoso',
       id: detenido.deId,
     }
   }
 
   async findAll(
     casoId: number,
     pagination: PaginacionQueryDto
   ): Promise<[PersonasImplicada[], number]> {
     return this.repository.findAll(casoId, pagination)
   }
 
   async findOne(deId: number): Promise<PersonasImplicada> {
     const persona = await this.repository.findOne(deId)
 
     if (!persona) {
       throw new NotFoundException(
         `No se encontró la persona implicada con id ${deId}`
       )
     }
 
     return persona
   }
 
   async update(
     deId: number,
     dto: UpdatePersonasImplicadasPdDto
   ): Promise<{
     message: string
     id: number
   }> {
     const persona = await this.repository.update(deId, dto)
 
     if (!persona) {
       throw new NotFoundException(
         `No se encontró la persona implicada con id ${deId}`
       )
     }
 
     return {
       message: 'Persona implicada actualizada exitosamente',
       id: persona.deId,
     }
   }
 
   async eliminarLogicamente(
   deId: number,
   dto: DeletePersonasImplicadaDto,
 ): Promise<{
   message: string;
   id: number;
 }> {
   const persona =
     await this.repository.eliminarLogicamente(
       deId,
       dto,
     );
 
   if (!persona) {
     throw new NotFoundException(
       `No se encontró la persona implicada activa con id ${deId}`,
     );
   }
 
   return {
     message: 'Persona implicada eliminada exitosamente',
     id: persona.deId,
   };
 }
}
