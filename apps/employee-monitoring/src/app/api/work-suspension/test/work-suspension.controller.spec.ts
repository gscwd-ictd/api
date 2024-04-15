import { Test, TestingModule } from '@nestjs/testing';
import { WorkSuspensionController } from '../core/work-suspension.controller';

describe('WorkSuspensionController', () => {
  let controller: WorkSuspensionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSuspensionController],
    }).compile();

    controller = module.get<WorkSuspensionController>(WorkSuspensionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
