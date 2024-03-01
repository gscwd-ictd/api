import { Test, TestingModule } from '@nestjs/testing';
import { DtrCorrectionController } from '../core/dtr-correction.controller';

describe('DtrCorrectionController', () => {
  let controller: DtrCorrectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DtrCorrectionController],
    }).compile();

    controller = module.get<DtrCorrectionController>(DtrCorrectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
