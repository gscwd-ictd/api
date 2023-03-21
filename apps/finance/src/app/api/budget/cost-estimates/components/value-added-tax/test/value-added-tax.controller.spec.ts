import { Test, TestingModule } from '@nestjs/testing';
import { ValueAddedTaxController } from '../core/value-added-tax.controller';
import { ValueAddedTaxService } from '../core/value-added-tax.service';

describe('ValueAddedTaxController', () => {
  let controller: ValueAddedTaxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValueAddedTaxController],
      providers: [ValueAddedTaxService],
    }).compile();

    controller = module.get<ValueAddedTaxController>(ValueAddedTaxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
