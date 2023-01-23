import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfMeasureController } from '../core/unit-measure.controller';

describe('UnitMeasureController', () => {
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
