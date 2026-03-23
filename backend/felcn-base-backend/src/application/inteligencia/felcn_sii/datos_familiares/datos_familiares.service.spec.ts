import { Test, TestingModule } from '@nestjs/testing';
import { DatosFamiliaresService } from './datos_familiares.service';

describe('DatosFamiliaresService', () => {
  let service: DatosFamiliaresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosFamiliaresService],
    }).compile();

    service = module.get<DatosFamiliaresService>(DatosFamiliaresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
