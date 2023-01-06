import { Test, TestingModule } from '@nestjs/testing';
import { LaborTypeController } from '../core/labor-type.controller';
import { LaborTypeService } from '../core/labor-type.service';

describe('LaborTypeController', () => {
  let controller: LaborTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaborTypeController],
      providers: [LaborTypeService],
    }).compile();

    controller = module.get<LaborTypeController>(LaborTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
