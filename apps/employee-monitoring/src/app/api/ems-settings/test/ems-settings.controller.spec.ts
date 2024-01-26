import { Test, TestingModule } from '@nestjs/testing';
import { EmsSettingsController } from '../core/ems-settings.controller';

describe('EmsSettingsController', () => {
  let controller: EmsSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmsSettingsController],
    }).compile();

    controller = module.get<EmsSettingsController>(EmsSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
