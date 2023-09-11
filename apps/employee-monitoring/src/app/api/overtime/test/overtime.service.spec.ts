import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeService } from '../core/overtime.service';

describe('OvertimeService', () => {
  let service: OvertimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeService],
    }).compile();

    service = module.get<OvertimeService>(OvertimeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
