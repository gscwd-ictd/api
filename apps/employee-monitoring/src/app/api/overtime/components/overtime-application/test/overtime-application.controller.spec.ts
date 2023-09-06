import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeApplicationController } from '../core/overtime-application.controller';

describe('OvertimeApplicationController', () => {
  let controller: OvertimeApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeApplicationController],
    }).compile();

    controller = module.get<OvertimeApplicationController>(OvertimeApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
