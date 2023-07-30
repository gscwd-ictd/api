import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCreditEarningsController } from '../core/leave-credit-earnings.controller';

describe('LeaveCreditEarningsController', () => {
  let controller: LeaveCreditEarningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveCreditEarningsController],
    }).compile();

    controller = module.get<LeaveCreditEarningsController>(LeaveCreditEarningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
