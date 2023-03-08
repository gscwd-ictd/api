import { Test, TestingModule } from '@nestjs/testing';
import { GeneralLedgerContraAccountTypeController } from '../core/contra-accounts.controller';
import { GeneralLedgerContraAccountTypeService } from '../core/contra-accounts.service';

describe('GeneralLedgerContraAccountTypeController', () => {
  let controller: GeneralLedgerContraAccountTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralLedgerContraAccountTypeController],
      providers: [GeneralLedgerContraAccountTypeService],
    }).compile();

    controller = module.get<GeneralLedgerContraAccountTypeController>(GeneralLedgerContraAccountTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
