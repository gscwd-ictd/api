import { Test, TestingModule } from '@nestjs/testing';
import { WorkSuspensionController } from '../core/work-suspension.controller';
import { WorkSuspensionService } from '../core/work-suspension.service';

describe('WorkSuspensionController', () => {
  let controller: WorkSuspensionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkSuspensionController],
      providers: [{ provide: WorkSuspensionService, useValue: {} }],
    }).compile();

    controller = module.get<WorkSuspensionController>(WorkSuspensionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
