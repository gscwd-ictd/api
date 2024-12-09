import { Test, TestingModule } from '@nestjs/testing';
import { LeaveMonetizationController } from './leave-monetization.controller';

describe('LeaveMonetizationController', () => {
  let controller: LeaveMonetizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveMonetizationController],
    }).compile();

    controller = module.get<LeaveMonetizationController>(LeaveMonetizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
