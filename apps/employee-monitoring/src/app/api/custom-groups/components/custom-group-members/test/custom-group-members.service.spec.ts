import { Test, TestingModule } from '@nestjs/testing';
import { CustomGroupMembersService } from '../core/custom-group-members.service';

describe('CustomGroupMembersService', () => {
  let service: CustomGroupMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomGroupMembersService],
    }).compile();

    service = module.get<CustomGroupMembersService>(CustomGroupMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
