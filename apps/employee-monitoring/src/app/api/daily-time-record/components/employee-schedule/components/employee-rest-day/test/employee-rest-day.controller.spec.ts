import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRestDayController } from '../core/employee-rest-day.controller';

describe('EmployeeRestDayController', () => {
  let controller: EmployeeRestDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeRestDayController],
    }).compile();

    controller = module.get<EmployeeRestDayController>(EmployeeRestDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
