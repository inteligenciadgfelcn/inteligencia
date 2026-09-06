import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { BaseController } from '@/common/base'

import { AuditoriaUsuarioInterceptor } from '@/common/interceptors/auditoria-usuario.interceptor'

import { JwtAuthGuard } from '@/core/config/authorization/guards/jwt-auth.guard'

import { SituacionJuridicaBienService } from './situacion_juridica_bien.service'

import { CreateSituacionJuridicaBienDto } from './dto/create-principal.dto'

import { UpdateSituacionJuridicaBienDto } from './dto/update-situacion_juridica_bien.dto'

import { CreateBienSecuestadoDto } from './dto/create-bien-secuestrado.dto'

import { CreateBienIncautadoDto } from './dto/create-bien-incautado.dto'

import { CreateBienConfiscadoDto } from './dto/create-bien-confiscado.dto'

import { CreateSituacionBienDto } from './dto/create-situacion-bien.dto'

import { UpdateBienSecuestradoDto } from './dto/update-bien-secuestrado.dto'

import { UpdateBienIncautadoDto } from './dto/update-bien-incautado.dto'

import { UpdateBienConfiscadoDto } from './dto/update-bien-confiscado.dto'

import { UpdateSituacionBienDto } from './dto/update-situacion-bien.dto'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditoriaUsuarioInterceptor)
@ApiTags('LGI - Situación jurídica del bien')
@ApiExtraModels(
  CreateBienSecuestadoDto,
  CreateBienIncautadoDto,
  CreateBienConfiscadoDto,
  CreateSituacionBienDto,
  UpdateBienSecuestradoDto,
  UpdateBienIncautadoDto,
  UpdateBienConfiscadoDto,
  UpdateSituacionBienDto
)
@Controller('situacion-juridica-bien')
export class SituacionJuridicaBienController extends BaseController {
  constructor(private readonly service: SituacionJuridicaBienService) {
    super()
  }

  @Post()
  @ApiOperation({
    summary: 'Registrar una situación jurídica del bien',
  })
  @ApiBody({
    type: CreateSituacionJuridicaBienDto,

    examples: {
      secuestrado: {
        summary: '1 - Bien secuestrado',

        value: {
          itembiensecId: 15,

          idTipoSituacionLegalBien: 1,

          datos: {
            fiscal: 'Juan Pérez López',

            fechaActaSecuestro: '2026-09-06',

            investigador: 'Carlos Mamani Quispe',
          },
        },
      },

      incautado: {
        summary: '2 - Bien incautado',

        value: {
          itembiensecId: 15,

          idTipoSituacionLegalBien: 2,

          datos: {
            nroResol: 'RES-123/2026',

            fechaResolucion: '2026-09-06',

            autoridad: 'Fiscalía Departamental de La Paz',
          },
        },
      },

      confiscado: {
        summary: '3 - Bien confiscado/decomisado',

        value: {
          itembiensecId: 15,

          idTipoSituacionLegalBien: 3,

          datos: {
            numSentJud: 'SENT-456/2026',

            fechaSenjud: '2026-09-06',

            autoridad: 'Juzgado de Sentencia Penal',
          },
        },
      },

      entregaDircabi: {
        summary: '4 - Entrega a DIRCABI',

        value: {
          itembiensecId: 15,

          idTipoSituacionLegalBien: 4,

          datos: {
            fechaRequerimiento: '2026-09-06',

            fiscalRequirente: 'Juan Pérez López',

            calbId: 1,

            fechaEntrega: '2026-09-07',

            responsableEntrega: 'Carlos Mamani Quispe',

            responsableRecepcion: 'María Condori Flores',

            institucion: 'DIRCABI',

            ubicacion: 'Depósito central',
          },
        },
      },

      situacionIncautado: {
        summary: '5 - Situación de bien incautado',

        value: {
          itembiensecId: 15,

          idTipoSituacionLegalBien: 5,

          datos: {
            fechaRequerimiento: '2026-09-06T10:30:00.000Z',

            fiscalRequirente: 'Juan Pérez López',

            calbId: 1,

            fechaEntrega: '2026-09-07T10:00:00.000Z',

            responsableEntrega: 'Carlos Mamani Quispe',

            responsableRecepcion: 'María Condori Flores',

            institucion: 'FELCN',

            ubicacion: 'Depósito de evidencias',
          },
        },
      },
    },
  })
  create(
    @Body()
    dto: CreateSituacionJuridicaBienDto
  ) {
    return this.service.create(dto)
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todas las situaciones jurídicas',
  })
  findAll() {
    return this.service.findAll()
  }

  @Get('bien/:itembiensecId')
  @ApiOperation({
    summary: 'Obtener el historial jurídico de un bien',
  })
  findByBien(
    @Param('itembiensecId', ParseIntPipe)
    itembiensecId: number
  ) {
    return this.service.findByBien(itembiensecId)
  }

  /*
   * Actualizar el registro seleccionado.
   *
   * idTipo:
   * 1 = bienes secuestrados
   * 2 = bienes incautados
   * 3 = bienes confiscados
   * 4 y 5 = situación de bienes
   */
  @Patch(':idTipo/:idRegistro')
  @ApiOperation({
    summary: 'Actualizar la situación jurídica seleccionada',
  })
  update(
    @Param('idTipo', ParseIntPipe)
    idTipo: number,

    @Param('idRegistro', ParseIntPipe)
    idRegistro: number,

    @Body()
    dto: UpdateSituacionJuridicaBienDto
  ) {
    return this.service.update(idTipo, idRegistro, dto)
  }

  @Delete(':idTipo/:idRegistro')
  @ApiOperation({
    summary: 'Eliminar la situación jurídica seleccionada',
  })
  remove(
    @Param('idTipo', ParseIntPipe)
    idTipo: number,

    @Param('idRegistro', ParseIntPipe)
    idRegistro: number
  ) {
    return this.service.remove(idTipo, idRegistro)
  }
}
