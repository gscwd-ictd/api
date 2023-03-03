import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeScheduleService } from '../core/employee-schedule.service';

describe('EmployeeScheduleService', () => {
  let service: EmployeeScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeScheduleService],
    }).compile();

    service = module.get<EmployeeScheduleService>(EmployeeScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
