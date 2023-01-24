import { Test, TestingModule } from '@nestjs/testing';
import { PpeCategoriesController } from '../core/categories.controller';

describe('CategoriesController', () => {
  let controller: PpeCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PpeCategoriesController],
    }).compile();

    controller = module.get<PpeCategoriesController>(PpeCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
