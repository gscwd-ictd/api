import { Test, TestingModule } from '@nestjs/testing';
import { UnitTypeService } from './unit-type.service';

describe('UnitTypeService', () => {
  let service: UnitTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitTypeService],
    }).compile();

    service = module.get<UnitTypeService>(UnitTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
