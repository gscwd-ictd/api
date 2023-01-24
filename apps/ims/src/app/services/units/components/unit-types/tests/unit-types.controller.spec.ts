import { Test, TestingModule } from '@nestjs/testing';
import { UnitTypesController } from '../core/unit-types.controller';

describe('UnitTypesController', () => {
  let controller: UnitTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitTypesController],
    }).compile();

    controller = module.get<UnitTypesController>(UnitTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
