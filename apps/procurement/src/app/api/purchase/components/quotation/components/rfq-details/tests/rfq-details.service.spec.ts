import { Test, TestingModule } from '@nestjs/testing';
import { RfqDetailsService } from '../core/rfq-details.service';

describe('RfqDetailsService', () => {
  let service: RfqDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfqDetailsService],
    }).compile();

    service = module.get<RfqDetailsService>(RfqDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
