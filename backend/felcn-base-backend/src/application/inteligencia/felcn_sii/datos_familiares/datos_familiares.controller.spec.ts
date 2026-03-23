import { Test, TestingModule } from '@nestjs/testing';
import { DatosFamiliaresController } from './datos_familiares.controller';
import { DatosFamiliaresService } from './datos_familiares.service';

describe('DatosFamiliaresController', () => {
  let controller: DatosFamiliaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosFamiliaresController],
      providers: [DatosFamiliaresService],
    }).compile();

    controller = module.get<DatosFamiliaresController>(DatosFamiliaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
