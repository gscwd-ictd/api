import { Test, TestingModule } from '@nestjs/testing';
import { AccountGroupsService } from '../core/account-groups.service';

describe('AccountGroupsService', () => {
  let service: AccountGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountGroupsService],
    }).compile();

    service = module.get<AccountGroupsService>(AccountGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
