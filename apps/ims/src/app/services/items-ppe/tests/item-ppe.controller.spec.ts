import { Test, TestingModule } from '@nestjs/testing';
import { ItemPpeController } from '../core/items-ppe.controller';

describe('ItemPpeController', () => {
  let controller: ItemPpeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemPpeController],
    }).compile();

    controller = module.get<ItemPpeController>(ItemPpeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
