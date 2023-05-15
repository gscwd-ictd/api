import { Test, TestingModule } from '@nestjs/testing';
import { TravelOrderController } from '../core/travel-order.controller';

describe('TravelOrderController', () => {
  let controller: TravelOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelOrderController],
    }).compile();

    controller = module.get<TravelOrderController>(TravelOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
