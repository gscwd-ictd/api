import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCardLedgerDebitService } from '../core/leave-card-ledger-debit.service';

describe('LeaveCardLedgerDebitService', () => {
  let service: LeaveCardLedgerDebitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveCardLedgerDebitService],
    }).compile();

    service = module.get<LeaveCardLedgerDebitService>(LeaveCardLedgerDebitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
