import { Test, TestingModule } from '@nestjs/testing';
import { LaborTypeService } from '../core/labor-type.service';

describe('LaborTypeService', () => {
  let service: LaborTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LaborTypeService],
    }).compile();

    service = module.get<LaborTypeService>(LaborTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
