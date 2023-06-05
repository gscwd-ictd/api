import { Test, TestingModule } from '@nestjs/testing';
import { CustomGroupsService } from '../core/custom-groups.service';

describe('CustomGroupsService', () => {
  let service: CustomGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomGroupsService],
    }).compile();

    service = module.get<CustomGroupsService>(CustomGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
