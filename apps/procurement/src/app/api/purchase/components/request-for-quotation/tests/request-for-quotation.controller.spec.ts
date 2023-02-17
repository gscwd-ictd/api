import { Test, TestingModule } from '@nestjs/testing';
import { RequestForQuotationController } from '../core/request-for-quotation.controller';

describe('RequestForQuotationController', () => {
  let controller: RequestForQuotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestForQuotationController],
    }).compile();

    controller = module.get<RequestForQuotationController>(RequestForQuotationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
