import { Test, TestingModule } from '@nestjs/testing';
import { MajorAccountGroupController } from '../core/major-account-groups.controller';
import { MajorAccountGroupService } from '../core/major-account-groups.service';

describe('MajorAccountGroupController', () => {
  let controller: MajorAccountGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorAccountGroupController],
      providers: [MajorAccountGroupService],
    }).compile();

    controller = module.get<MajorAccountGroupController>(MajorAccountGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
