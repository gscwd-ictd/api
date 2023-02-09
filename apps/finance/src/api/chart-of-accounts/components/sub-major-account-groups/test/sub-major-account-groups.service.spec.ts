import { Test, TestingModule } from '@nestjs/testing';
import { SubMajorAccountGroupService } from '../core/sub-major-account-groups.service';

describe('SubMajorAccountGroupService', () => {
  let service: SubMajorAccountGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubMajorAccountGroupService],
    }).compile();

    service = module.get<SubMajorAccountGroupService>(SubMajorAccountGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
