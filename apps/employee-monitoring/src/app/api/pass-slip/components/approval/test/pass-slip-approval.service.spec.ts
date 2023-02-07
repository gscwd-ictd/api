import { Test, TestingModule } from '@nestjs/testing';
import { PassSlipApprovalService } from './pass-slip-approval.service';

describe('PassSlipApprovalService', () => {
  let service: PassSlipApprovalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassSlipApprovalService],
    }).compile();

    service = module.get<PassSlipApprovalService>(PassSlipApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
