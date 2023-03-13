import { Test, TestingModule } from '@nestjs/testing';
import { ValueAddedTaxService } from '../core/value-added-tax.service';

describe('ValueAddedTaxService', () => {
  let service: ValueAddedTaxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValueAddedTaxService],
    }).compile();

    service = module.get<ValueAddedTaxService>(ValueAddedTaxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
