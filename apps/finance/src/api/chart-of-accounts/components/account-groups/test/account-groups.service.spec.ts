import { Test, TestingModule } from '@nestjs/testing';
import { AccountGroupService } from '../core/account-groups.service';

describe('AccountGroupService', () => {
  let service: AccountGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountGroupService],
    }).compile();

    service = module.get<AccountGroupService>(AccountGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
