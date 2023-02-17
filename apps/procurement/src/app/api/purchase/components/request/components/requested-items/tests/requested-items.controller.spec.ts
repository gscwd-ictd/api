import { Test, TestingModule } from '@nestjs/testing';
import { RequestedItemsController } from '../core/requested-items.controller';

describe('RequestedItemsController', () => {
  let controller: RequestedItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestedItemsController],
    }).compile();

    controller = module.get<RequestedItemsController>(RequestedItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
