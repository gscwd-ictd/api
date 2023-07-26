import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCardLedgerCreditService } from '../core/leave-card-ledger-credit.service';

describe('LeaveCardLedgerCreditService', () => {
  let service: LeaveCardLedgerCreditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveCardLedgerCreditService],
    }).compile();

    service = module.get<LeaveCardLedgerCreditService>(LeaveCardLedgerCreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
