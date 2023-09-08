import { Test, TestingModule } from '@nestjs/testing';
import { OvertimeAccomplishmentController } from '../core/overtime-accomplishment.controller';

describe('OvertimeAccomplishmentController', () => {
  let controller: OvertimeAccomplishmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OvertimeAccomplishmentController],
    }).compile();

    controller = module.get<OvertimeAccomplishmentController>(OvertimeAccomplishmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
