import { Test, TestingModule } from '@nestjs/testing';
import { DailyTimeRecordController } from '../core/daily-time-record.controller';

describe('DailyTimeRecordController', () => {
  let controller: DailyTimeRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyTimeRecordController],
    }).compile();

    controller = module.get<DailyTimeRecordController>(DailyTimeRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
