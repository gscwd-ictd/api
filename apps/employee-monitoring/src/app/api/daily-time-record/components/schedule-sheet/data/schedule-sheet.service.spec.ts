import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleSheetService } from '../core/schedule-sheet.service';

describe('ScheduleSheetService', () => {
  let service: ScheduleSheetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleSheetService],
    }).compile();

    service = module.get<ScheduleSheetService>(ScheduleSheetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
