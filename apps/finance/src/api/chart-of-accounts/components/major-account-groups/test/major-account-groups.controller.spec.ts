import { Test, TestingModule } from '@nestjs/testing';
import { MajorAccountGroupsController } from '../core/major-account-groups.controller';
import { MajorAccountGroupsService } from '../core/major-account-groups.service';

describe('MajorAccountGroupsController', () => {
  let controller: MajorAccountGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorAccountGroupsController],
      providers: [MajorAccountGroupsService],
    }).compile();

    controller = module.get<MajorAccountGroupsController>(MajorAccountGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
