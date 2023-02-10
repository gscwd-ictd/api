import { Test, TestingModule } from '@nestjs/testing';
import { ModeOfPaymentController } from './mode-of-payment.controller';

describe('ModeOfPaymentController', () => {
  let controller: ModeOfPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModeOfPaymentController],
    }).compile();

    controller = module.get<ModeOfPaymentController>(ModeOfPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
