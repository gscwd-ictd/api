import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRestDaysService } from '../core/employee-rest-days.service';

describe('EmployeeRestDaysService', () => {
  let service: EmployeeRestDaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeRestDaysService],
    }).compile();

    service = module.get<EmployeeRestDaysService>(EmployeeRestDaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
