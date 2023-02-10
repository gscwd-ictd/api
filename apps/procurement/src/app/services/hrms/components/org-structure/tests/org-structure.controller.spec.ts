import { Test, TestingModule } from '@nestjs/testing';
import { OrgStructureController } from '../core/org-structure.controller';

describe('OrgStructureController', () => {
  let controller: OrgStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrgStructureController],
    }).compile();

    controller = module.get<OrgStructureController>(OrgStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
