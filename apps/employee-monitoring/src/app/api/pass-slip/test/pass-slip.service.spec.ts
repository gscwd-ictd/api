import { Test, TestingModule } from '@nestjs/testing';
import { PassSlipService } from '../core/pass-slip.service';

describe('PassSlipService', () => {
  let service: PassSlipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassSlipService],
    }).compile();

    service = module.get<PassSlipService>(PassSlipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
