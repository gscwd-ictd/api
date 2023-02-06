import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApplicationDatesController } from '../core/leave-application-dates.controller';

describe('LeaveApplicationDatesController', () => {
  let controller: LeaveApplicationDatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveApplicationDatesController],
    }).compile();

    controller = module.get<LeaveApplicationDatesController>(LeaveApplicationDatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
