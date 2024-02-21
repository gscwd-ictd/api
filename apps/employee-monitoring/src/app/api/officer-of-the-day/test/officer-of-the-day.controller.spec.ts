import { Test, TestingModule } from '@nestjs/testing';
import { OfficerOfTheDayController } from '../core/officer-of-the-day.controller';

describe('OfficerOfTheDayController', () => {
  let controller: OfficerOfTheDayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfficerOfTheDayController],
    }).compile();

    controller = module.get<OfficerOfTheDayController>(OfficerOfTheDayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
