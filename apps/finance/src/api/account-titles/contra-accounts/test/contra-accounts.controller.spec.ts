import { Test, TestingModule } from '@nestjs/testing';
import { ContraAccountController } from '../core/contra-accounts.controller';
import { ContraAccountService } from '../core/contra-accounts.service';

describe('ContraAccountController', () => {
  let controller: ContraAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContraAccountController],
      providers: [ContraAccountService],
    }).compile();

    controller = module.get<ContraAccountController>(ContraAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
