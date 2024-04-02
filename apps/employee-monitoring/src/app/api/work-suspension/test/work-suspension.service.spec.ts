import { Test, TestingModule } from '@nestjs/testing';
import { WorkSuspensionService } from '../core/work-suspension.service';

describe('WorkSuspensionService', () => {
  let service: WorkSuspensionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkSuspensionService],
    }).compile();

    service = module.get<WorkSuspensionService>(WorkSuspensionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
