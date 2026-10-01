import { Module } from '@nestjs/common';
import { PersonasJuridicasPdService } from './personas_juridicas_pd.service';
import { PersonasJuridicasPdController } from './personas_juridicas_pd.controller';
import { PersonasJuridica } from '@/application/lgi/personas_juridicas/entities/personas_juridica.entity';
import { DB_LGI } from '@/core/config/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasJuridicasPdRepository } from './repository/personas_juridicas.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PersonasJuridica], DB_LGI)],

  controllers: [PersonasJuridicasPdController,],
  providers: [PersonasJuridicasPdService, PersonasJuridicasPdRepository],
  exports: [PersonasJuridicasPdService, PersonasJuridicasPdRepository],
})
export class PersonasJuridicasPdModule { }
