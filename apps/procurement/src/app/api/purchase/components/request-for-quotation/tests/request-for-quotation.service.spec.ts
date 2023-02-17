import { Test, TestingModule } from '@nestjs/testing';
import { RequestForQuotationService } from '../core/request-for-quotation.service';

describe('RequestForQuotationService', () => {
  let service: RequestForQuotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestForQuotationService],
    }).compile();

    service = module.get<RequestForQuotationService>(RequestForQuotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
