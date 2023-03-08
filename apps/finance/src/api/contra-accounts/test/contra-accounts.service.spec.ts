import { Test, TestingModule } from '@nestjs/testing';
import { ContraAccountService } from '../core/contra-accounts.service';

describe('ContraAccountService', () => {
  let service: ContraAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContraAccountService],
    }).compile();

    service = module.get<ContraAccountService>(ContraAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
