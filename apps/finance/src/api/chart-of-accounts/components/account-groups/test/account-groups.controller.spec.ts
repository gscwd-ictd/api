import { Test, TestingModule } from '@nestjs/testing';
import { AccountGroupsController } from '../core/account-groups.controller';
import { AccountGroupsService } from '../core/account-groups.service';

describe('AccountGroupsController', () => {
  let controller: AccountGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountGroupsController],
      providers: [AccountGroupsService],
    }).compile();

    controller = module.get<AccountGroupsController>(AccountGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
