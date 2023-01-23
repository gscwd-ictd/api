import { Test, TestingModule } from '@nestjs/testing';
import { PpeClassificationsController } from '../core/classifications.controller';

describe('ClassificationsController', () => {
  let controller: PpeClassificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PpeClassificationsController],
    }).compile();

    controller = module.get<PpeClassificationsController>(PpeClassificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
