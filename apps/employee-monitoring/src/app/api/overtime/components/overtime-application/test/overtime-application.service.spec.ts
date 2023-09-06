import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeApplicationService } from '../core/overtime-application.service';

describe('OvertimeApplicationService', () => {
  let service: OvertimeApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeApplicationService],
    }).compile();

    service = module.get<OvertimeApplicationService>(OvertimeApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
