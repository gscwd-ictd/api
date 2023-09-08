import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeEmployeeService } from '../core/overtime-employee.service';

describe('OvertimeEmployeeService', () => {
  let service: OvertimeEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeEmployeeService],
    }).compile();

    service = module.get<OvertimeEmployeeService>(OvertimeEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
