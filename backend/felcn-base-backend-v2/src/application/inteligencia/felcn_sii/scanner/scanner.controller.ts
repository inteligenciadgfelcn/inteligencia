import {
  Body,
  Controller,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard }
  from '@/core/config/authorization/guards/jwt-auth.guard';

import { ScannerGateway }
  from './scanner.gateway';

import { CapturarHuellaDto }
  from './dto/capturar.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Scanner - Huellas')
@Controller('scanner')
export class ScannerController
{
  constructor(
    private readonly gateway:
      ScannerGateway,
  ) {}

  @Post('capturar')
  @ApiOperation({
    summary:
      'Capturar huella',
  })
  capturar(
    @Body()
    dto: CapturarHuellaDto,
  )
  {
    /*
     VALIDAR
    */
    const scanner =
      this.gateway.getScanner(
        dto.scannerId,
      );

    if (!scanner)
    {
      throw new BadRequestException(
        'Scanner no encontrado',
      );
    }

    if (
      scanner.estado !==
      'DISPONIBLE'
    )
    {
      throw new BadRequestException(
        'Scanner no disponible',
      );
    }

    /*
     ENVIAR
    */
    this.gateway.sendToScanner(
      dto.scannerId,
      'capture-fingerprint',
      {
        personaId:
          dto.personaId,

        dedo:
          dto.dedo,
      },
    );

    return {
      ok: true,

      mensaje:
        'Captura enviada',
    };
  }
}