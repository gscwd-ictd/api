import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationsController } from '../core/specifications.controller';

describe('SpecificationsController', () => {
  let controller: SpecificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecificationsController],
    }).compile();

    controller = module.get<SpecificationsController>(SpecificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
