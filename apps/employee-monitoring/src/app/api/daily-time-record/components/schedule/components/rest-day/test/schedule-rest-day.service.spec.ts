import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleRestDayService } from './schedule-rest-day.service';

describe('ScheduleRestDayService', () => {
  let service: ScheduleRestDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleRestDayService],
    }).compile();

    service = module.get<ScheduleRestDayService>(ScheduleRestDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
