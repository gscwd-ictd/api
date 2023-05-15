import { Test, TestingModule } from '@nestjs/testing';
import { TravelOrderItineraryController } from '../core/travel-order-itinerary.controller';

describe('TravelOrderItineraryController', () => {
  let controller: TravelOrderItineraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelOrderItineraryController],
    }).compile();

    controller = module.get<TravelOrderItineraryController>(TravelOrderItineraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
