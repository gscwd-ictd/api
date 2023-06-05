import { Test, TestingModule } from '@nestjs/testing';
import { CustomGroupsController } from '../core/custom-groups.controller';

describe('CustomGroupsController', () => {
  let controller: CustomGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomGroupsController],
    }).compile();

    controller = module.get<CustomGroupsController>(CustomGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
