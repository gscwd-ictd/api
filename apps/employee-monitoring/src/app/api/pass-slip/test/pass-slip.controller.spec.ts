import { Test, TestingModule } from '@nestjs/testing';
import { PassSlipController } from '../core/pass-slip.controller';

describe('PassSlipController', () => {
  let controller: PassSlipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassSlipController],
    }).compile();

    controller = module.get<PassSlipController>(PassSlipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
