import { Test, TestingModule } from '@nestjs/testing';
import { OrgStructureService } from '../core/org-structure.service';

describe('OrgStructureService', () => {
  let service: OrgStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrgStructureService],
    }).compile();

    service = module.get<OrgStructureService>(OrgStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
