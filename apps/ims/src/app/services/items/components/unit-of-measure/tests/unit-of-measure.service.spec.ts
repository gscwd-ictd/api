import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfMeasureService } from './unit-of-measure.service';

describe('UnitOfMeasureService', () => {
  let service: UnitOfMeasureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitOfMeasureService],
    }).compile();

    service = module.get<UnitOfMeasureService>(UnitOfMeasureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
