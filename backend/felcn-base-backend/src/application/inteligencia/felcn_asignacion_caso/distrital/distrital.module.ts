import { Module } from '@nestjs/common'
import { DistritalService } from './distrital.service'
import { DistritalController } from './distrital.controller'

@Module({
  controllers: [DistritalController],
  providers: [DistritalService],
})
export class DistritalModule {}
