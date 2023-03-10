import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLedgerAccountService } from '../core/general-ledger-accounts.service';

describe('GeneralLedgerAccountService', () => {
  let service: GeneralLedgerAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralLedgerAccountService],
    }).compile();

    service = module.get<GeneralLedgerAccountService>(GeneralLedgerAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
