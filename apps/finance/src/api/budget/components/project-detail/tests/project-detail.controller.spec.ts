import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDetailController } from '../core/project-detail.controller';

describe('ProjectDetailController', () => {
  let controller: ProjectDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDetailController],
    }).compile();

    controller = module.get<ProjectDetailController>(ProjectDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
