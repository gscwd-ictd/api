import { Test, TestingModule } from '@nestjs/testing';
import { PpeSpecificationsController } from '../core/specifications.controller';

describe('SpecificationsController', () => {
  let controller: PpeSpecificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PpeSpecificationsController],
    }).compile();

    controller = module.get<PpeSpecificationsController>(PpeSpecificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
