import { Test, TestingModule } from '@nestjs/testing';
import { LeaveCardLedgerCreditController } from '../core/leave-card-ledger-credit.controller';

describe('LeaveCardLedgerCreditController', () => {
  let controller: LeaveCardLedgerCreditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveCardLedgerCreditController],
    }).compile();

    controller = module.get<LeaveCardLedgerCreditController>(LeaveCardLedgerCreditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
