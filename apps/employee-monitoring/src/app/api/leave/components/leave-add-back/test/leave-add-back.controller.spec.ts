import { Test, TestingModule } from '@nestjs/testing';
import { LeaveAddBackController } from '../core/leave-add-back.controller';

describe('LeaveAddBackController', () => {
  let controller: LeaveAddBackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaveAddBackController],
    }).compile();

    controller = module.get<LeaveAddBackController>(LeaveAddBackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
