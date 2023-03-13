import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfMeasureController } from '../core/unit-of-measure.controller';

describe('UnitOfMeasureController', () => {
  let controller: UnitOfMeasureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitOfMeasureController],
    }).compile();

    controller = module.get<UnitOfMeasureController>(UnitOfMeasureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
