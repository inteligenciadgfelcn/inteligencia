import { Injectable } from '@nestjs/common';
import { UpdateSituacionJuridicaDto } from './dto/update-situacion_juridica.dto';
import { CreateSituacionJuridicaDto } from './dto/create-situacion_juridica.dto';
import { SituacionJuridicaRepository } from './repository/situacion_juridica.repository';

@Injectable()
export class SituacionJuridicaService {
 constructor(
    private readonly repository:
      SituacionJuridicaRepository,
  ) {}

  async registrarSituacionJuridica(
    dto: CreateSituacionJuridicaDto,
  ): Promise<{
    message: string;
    id: number;
  }> {
    const situacion =
      await this.repository.registrarSituacionJuridica(dto);

    return {
      message: 'Situación jurídica registrada exitosamente',
      id: situacion.situacionId,
    };
  }

  findAll() {
    return `This action returns all situacionJuridica`;
  }

  findOne(id: number) {
    return `This action returns a #${id} situacionJuridica`;
  }

  update(id: number, updateSituacionJuridicaDto: UpdateSituacionJuridicaDto) {
    return `This action updates a #${id} situacionJuridica`;
  }

  remove(id: number) {
    return `This action removes a #${id} situacionJuridica`;
  }
}
