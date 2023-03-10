import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLedgerAccountController } from '../core/general-ledger-accounts.controller';
import { GeneralLedgerAccountService } from '../core/general-ledger-accounts.service';

describe('GeneralLedgerAccountController', () => {
  let controller: GeneralLedgerAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralLedgerAccountController],
      providers: [GeneralLedgerAccountService],
    }).compile();

    controller = module.get<GeneralLedgerAccountController>(GeneralLedgerAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
