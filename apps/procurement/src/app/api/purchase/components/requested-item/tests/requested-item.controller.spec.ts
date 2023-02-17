import { Test, TestingModule } from '@nestjs/testing';
import { RequestedItemController } from '../core/requested-item.controller';

describe('RequestedItemController', () => {
  let controller: RequestedItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestedItemController],
    }).compile();

    controller = module.get<RequestedItemController>(RequestedItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
