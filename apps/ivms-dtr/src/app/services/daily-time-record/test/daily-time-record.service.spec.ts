import { Test, TestingModule } from '@nestjs/testing';
import { DailyTimeRecordService } from '../core/daily-time-record.service';

describe('DailyTimeRecordService', () => {
  let service: DailyTimeRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyTimeRecordService],
    }).compile();

    service = module.get<DailyTimeRecordService>(DailyTimeRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
