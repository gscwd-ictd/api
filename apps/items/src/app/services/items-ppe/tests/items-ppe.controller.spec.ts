import { Test, TestingModule } from '@nestjs/testing';
import { ItemsPpeController } from '../core/items-ppe.controller';

describe('ItemsPpeController', () => {
  let controller: ItemsPpeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsPpeController],
    }).compile();

    controller = module.get<ItemsPpeController>(ItemsPpeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
