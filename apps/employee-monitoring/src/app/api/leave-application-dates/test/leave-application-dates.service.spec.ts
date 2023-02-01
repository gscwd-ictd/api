import { Test, TestingModule } from '@nestjs/testing';
import { LeaveApplicationDatesService } from './leave-application-dates.service';

describe('LeaveApplicationDatesService', () => {
  let service: LeaveApplicationDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveApplicationDatesService],
    }).compile();

    service = module.get<LeaveApplicationDatesService>(LeaveApplicationDatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
