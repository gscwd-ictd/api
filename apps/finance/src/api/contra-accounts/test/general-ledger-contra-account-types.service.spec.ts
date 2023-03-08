import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLedgerContraAccountTypeService } from '../core/contra-accounts.service';

describe('GeneralLedgerContraAccountTypeService', () => {
  let service: GeneralLedgerContraAccountTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralLedgerContraAccountTypeService],
    }).compile();

    service = module.get<GeneralLedgerContraAccountTypeService>(GeneralLedgerContraAccountTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
