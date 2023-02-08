import { Test, TestingModule } from '@nestjs/testing';
import { MajorAccountGroupsService } from '../core/major-account-groups.service';

describe('MajorAccountGroupsService', () => {
  let service: MajorAccountGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MajorAccountGroupsService],
    }).compile();

    service = module.get<MajorAccountGroupsService>(MajorAccountGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
