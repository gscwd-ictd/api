import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeEmployeeController } from '../core/overtime-employee.controller';

describe('OvertimeEmployeeController', () => {
  let controller: OvertimeEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeEmployeeController],
    }).compile();

    controller = module.get<OvertimeEmployeeController>(OvertimeEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
