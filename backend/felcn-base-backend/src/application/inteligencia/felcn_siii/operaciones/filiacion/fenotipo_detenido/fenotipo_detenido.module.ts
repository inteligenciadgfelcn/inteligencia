import { Module } from '@nestjs/common'
import { FenotipoDetenidoService } from './fenotipo_detenido.service'
import { FenotipoDetenidoController } from './fenotipo_detenido.controller'
import { FenotipoDetenido } from './entities/fenotipo_detenido.entity'
import { DB_SIII } from '@/core/config/database/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TipoNariz } from '../../../parametricas/tipo_nariz/entities/tipo_nariz.entity'
import { ColorPiel } from '../../../parametricas/color_piel/entities/color_piel.entity'
import { ColorCabello } from '../../../parametricas/color_cabello/entities/color_cabello.entity'
import { ConstitucionCorporal } from '../../../parametricas/constitucion_corporal/entities/constitucion_corporal.entity'
import { TipoCabello } from '../../../parametricas/tipo_cabello/entities/tipo_cabello.entity'
import { ColorOjo } from '../../../parametricas/color_ojos/entities/color_ojo.entity'
import { TipoOjo } from '../../../parametricas/tipo_ojos/entities/tipo_ojo.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        FenotipoDetenido,
        TipoNariz,
        ColorPiel,
        ColorCabello,
        ConstitucionCorporal,
        TipoCabello,
        ColorOjo,
        TipoOjo,
      ],
      DB_SIII
    ),
  ],
  controllers: [FenotipoDetenidoController],
  providers: [FenotipoDetenidoService],
})
export class FenotipoDetenidoModule {}
