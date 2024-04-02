import { Test, TestingModule } from '@nestjs/testing';
import { AppwriteService } from '../core/appwrite.service';

describe('AppwriteService', () => {
  let service: AppwriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppwriteService],
    }).compile();

    service = module.get<AppwriteService>(AppwriteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
