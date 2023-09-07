import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeApprovalController } from '../core/overtime-approval.controller';

describe('OvertimeApprovalController', () => {
  let controller: OvertimeApprovalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeApprovalController],
    }).compile();

    controller = module.get<OvertimeApprovalController>(OvertimeApprovalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
