import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRestdaysService } from './employee-restdays.service';

describe('EmployeeRestdaysService', () => {
  let service: EmployeeRestdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeRestdaysService],
    }).compile();

    service = module.get<EmployeeRestdaysService>(EmployeeRestdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
