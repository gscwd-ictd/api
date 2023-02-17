import { Test, TestingModule } from '@nestjs/testing';
import { RfqDetailsController } from '../core/rfq-details.controller';

describe('RfqDetailsController', () => {
  let controller: RfqDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RfqDetailsController],
    }).compile();

    controller = module.get<RfqDetailsController>(RfqDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
