import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCreditDeductionsController } from '../core/leave-credit-deductions.controller';

describe('LeaveCreditDeductionsController', () => {
  let controller: LeaveCreditDeductionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveCreditDeductionsController],
    }).compile();

    controller = module.get<LeaveCreditDeductionsController>(LeaveCreditDeductionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
