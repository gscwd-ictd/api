import { Test, TestingModule } from '@nestjs/testing';
import { PassSlipApprovalController } from '../core/pass-slip-approval.controller';

describe('PassSlipApprovalController', () => {
  let controller: PassSlipApprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassSlipApprovalController],
    }).compile();

    controller = module.get<PassSlipApprovalController>(PassSlipApprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
