import { Module } from '@nestjs/common';
import { CatalogoFiscaliaController } from './catalogo-fiscalia.controller';

@Module({
  controllers: [CatalogoFiscaliaController]
})
export class CatalogoFiscaliaModule {}
