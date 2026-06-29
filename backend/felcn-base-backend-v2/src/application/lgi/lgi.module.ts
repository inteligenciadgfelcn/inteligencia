

import { Module } from '@nestjs/common'
import { UnidadModule } from './parametro/unidad/unidad.module';

@Module({
  imports: [
    UnidadModule
  ],
})
export class LgiModule {}