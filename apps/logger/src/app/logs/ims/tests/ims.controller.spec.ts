import { Test, TestingModule } from '@nestjs/testing';
import { ImsController } from '../core/ims.controller';

describe('ImsController', () => {
  let controller: ImsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImsController],
    }).compile();

    controller = module.get<ImsController>(ImsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
