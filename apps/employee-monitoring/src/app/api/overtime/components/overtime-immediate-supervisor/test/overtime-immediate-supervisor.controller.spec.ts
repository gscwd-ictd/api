import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeImmediateSupervisorController } from '../core/overtime-immediate-supervisor.controller';

describe('OvertimeImmediateSupervisorController', () => {
  let controller: OvertimeImmediateSupervisorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeImmediateSupervisorController],
    }).compile();

    controller = module.get<OvertimeImmediateSupervisorController>(OvertimeImmediateSupervisorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
