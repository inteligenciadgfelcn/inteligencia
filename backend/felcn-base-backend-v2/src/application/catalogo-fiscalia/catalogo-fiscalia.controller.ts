import { Body, Controller, Post } from '@nestjs/common';
import { UnidadLgiService } from '../lgi/parametro/unidad/unidad.service';
import { CreateUnidadDto } from '../lgi/parametro/unidad/dto/create-unidad.dto';

@Controller('catalogo-fiscalia')
export class CatalogoFiscaliaController {
     constructor(
        private readonly unidadService: UnidadLgiService,
      ) {}
    
     @Post()
      create(@Body() dto: CreateUnidadDto) {
        return this.unidadService.create(dto)
      }
}
