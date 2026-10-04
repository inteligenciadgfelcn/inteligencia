import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VinculoBienLgiService } from './vinculo_bien_lgi.service';
import { CreateVinculoBienLgiDto } from './dto/create-vinculo_bien_lgi.dto';
import { UpdateVinculoBienLgiDto } from './dto/update-vinculo_bien_lgi.dto';

@Controller('vinculo-bien-lgi')
export class VinculoBienLgiController {
  constructor(private readonly vinculoBienLgiService: VinculoBienLgiService) {}

  @Post()
  create(@Body() dto: CreateVinculoBienLgiDto) {
    return this.vinculoBienLgiService.create(dto)
  }

  @Get()
  findAll() {
    return this.vinculoBienLgiService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vinculoBienLgiService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVinculoBienLgiDto
  ) {
    return this.vinculoBienLgiService.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vinculoBienLgiService.remove(id)
  }
}
