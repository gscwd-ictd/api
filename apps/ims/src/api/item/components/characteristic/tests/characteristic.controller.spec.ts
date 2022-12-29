import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicController } from '../core/characteristic.controller';

describe('CharacteristicController', () => {
  let controller: CharacteristicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacteristicController],
    }).compile();

    controller = module.get<CharacteristicController>(CharacteristicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
