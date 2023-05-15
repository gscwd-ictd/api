import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeScheduleController } from '../core/employee-schedule.controller';

describe('EmployeeScheduleController', () => {
  let controller: EmployeeScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeScheduleController],
    }).compile();

    controller = module.get<EmployeeScheduleController>(EmployeeScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
