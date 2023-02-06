import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApplicationController } from '../core/leave-application.controller';

describe('LeaveApplicationController', () => {
  let controller: LeaveApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveApplicationController],
    }).compile();

    controller = module.get<LeaveApplicationController>(LeaveApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
