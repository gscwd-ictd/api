import { Test, TestingModule } from '@nestjs/testing';
import { OfficerOfTheDayService } from '../core/officer-of-the-day.service';

describe('OfficerOfTheDayService', () => {
  let service: OfficerOfTheDayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfficerOfTheDayService],
    }).compile();

    service = module.get<OfficerOfTheDayService>(OfficerOfTheDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
