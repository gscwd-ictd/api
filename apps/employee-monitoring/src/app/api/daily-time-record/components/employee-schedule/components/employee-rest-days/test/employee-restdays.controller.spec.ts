import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeRestDaysController } from '../core/employee-rest-days.controller';

describe('EmployeeRestDaysController', () => {
  let controller: EmployeeRestDaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeRestDaysController],
    }).compile();

    controller = module.get<EmployeeRestDaysController>(EmployeeRestDaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
