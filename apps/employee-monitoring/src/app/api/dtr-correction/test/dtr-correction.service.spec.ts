import { Test, TestingModule } from '@nestjs/testing';
import { DtrCorrectionService } from '../core/dtr-correction.service';

describe('DtrCorrectionService', () => {
  let service: DtrCorrectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DtrCorrectionService],
    }).compile();

    service = module.get<DtrCorrectionService>(DtrCorrectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
