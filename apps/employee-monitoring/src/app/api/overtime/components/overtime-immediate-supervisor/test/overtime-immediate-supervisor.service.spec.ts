import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeImmediateSupervisorService } from '../core/overtime-immediate-supervisor.service';

describe('OvertimeImmediateSupervisorService', () => {
  let service: OvertimeImmediateSupervisorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeImmediateSupervisorService],
    }).compile();

    service = module.get<OvertimeImmediateSupervisorService>(OvertimeImmediateSupervisorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
