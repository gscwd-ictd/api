import { Test, TestingModule } from '@nestjs/testing';
import { ImsService } from './ims.service';

describe('ImsService', () => {
  let service: ImsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImsService],
    }).compile();

    service = module.get<ImsService>(ImsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
