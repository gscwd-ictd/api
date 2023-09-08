import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeApprovalService } from '../core/overtime-approval.service';

describe('OvertimeApprovalService', () => {
  let service: OvertimeApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OvertimeApprovalService],
    }).compile();

    service = module.get<OvertimeApprovalService>(OvertimeApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
