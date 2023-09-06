import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeController } from '../core/overtime.controller';

describe('OvertimeController', () => {
  let controller: OvertimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeController],
    }).compile();

    controller = module.get<OvertimeController>(OvertimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
