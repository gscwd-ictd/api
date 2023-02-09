import { Test, TestingModule } from '@nestjs/testing';
import { SubMajorAccountGroupController } from '../core/sub-major-account-groups.controller';
import { SubMajorAccountGroupService } from '../core/sub-major-account-groups.service';

describe('SubMajorAccountGroupController', () => {
  let controller: SubMajorAccountGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubMajorAccountGroupController],
      providers: [SubMajorAccountGroupService],
    }).compile();

    controller = module.get<SubMajorAccountGroupController>(SubMajorAccountGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
