import { Test, TestingModule } from '@nestjs/testing';
import { AccountGroupController } from '../core/account-groups.controller';
import { AccountGroupService } from '../core/account-groups.service';

describe('AccountGroupsController', () => {
  let controller: AccountGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountGroupController],
      providers: [AccountGroupService],
    }).compile();

    controller = module.get<AccountGroupController>(AccountGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
