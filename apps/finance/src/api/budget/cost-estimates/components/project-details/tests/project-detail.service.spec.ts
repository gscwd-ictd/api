import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDetailService } from '../core/project-details.service';

describe('ProjectDetailService', () => {
  let service: ProjectDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectDetailService],
    }).compile();

    service = module.get<ProjectDetailService>(ProjectDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
