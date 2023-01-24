import { Test, TestingModule } from '@nestjs/testing';
import { UnitTypesService } from '../core/unit-types.service';

describe('UnitTypesService', () => {
  let service: UnitTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitTypesService],
    }).compile();

    service = module.get<UnitTypesService>(UnitTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
