import { Test, TestingModule } from '@nestjs/testing';
import { MajorAccountGroupService } from '../core/major-account-groups.service';

describe('MajorAccountGroupService', () => {
  let service: MajorAccountGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MajorAccountGroupService],
    }).compile();

    service = module.get<MajorAccountGroupService>(MajorAccountGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
