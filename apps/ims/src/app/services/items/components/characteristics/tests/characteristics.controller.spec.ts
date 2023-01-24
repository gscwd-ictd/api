import { Test, TestingModule } from '@nestjs/testing';
import { CharacteristicsController } from '../core/characteristics.controller';

describe('CharacteristicsController', () => {
  let controller: CharacteristicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacteristicsController],
    }).compile();

    controller = module.get<CharacteristicsController>(CharacteristicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
