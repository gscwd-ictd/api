import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleRestDayController } from '../core/schedule-rest-day.controller';

describe('ScheduleRestDayController', () => {
  let controller: ScheduleRestDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleRestDayController],
    }).compile();

    controller = module.get<ScheduleRestDayController>(ScheduleRestDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
