import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationController } from '../core/specification.controller';

describe('SpecificationController', () => {
  let controller: SpecificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecificationController],
    }).compile();

    controller = module.get<SpecificationController>(SpecificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
