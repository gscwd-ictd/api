import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRestDayService } from './employee-rest-day.service';

describe('EmployeeRestDayService', () => {
  let service: EmployeeRestDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeRestDayService],
    }).compile();

    service = module.get<EmployeeRestDayService>(EmployeeRestDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
