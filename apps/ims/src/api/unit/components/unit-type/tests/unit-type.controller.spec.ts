import { Test, TestingModule } from '@nestjs/testing';
import { UnitTypeController } from '../core/unit-type.controller';

describe('UnitTypeController', () => {
  let controller: UnitTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitTypeController],
    }).compile();

    controller = module.get<UnitTypeController>(UnitTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
