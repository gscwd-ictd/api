import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCardLedgerDebitController } from '../core/leave-card-ledger-debit.controller';

describe('LeaveCardLedgerDebitController', () => {
  let controller: LeaveCardLedgerDebitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveCardLedgerDebitController],
    }).compile();

    controller = module.get<LeaveCardLedgerDebitController>(LeaveCardLedgerDebitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
