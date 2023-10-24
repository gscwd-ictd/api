import { Test, TestingModule } from '@nestjs/testing';
import { ModulesController } from '../core/modules.controller';

describe('ModulesController', () => {
  let controller: ModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
    }).compile();

    controller = module.get<ModulesController>(ModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
