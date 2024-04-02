import { Test, TestingModule } from '@nestjs/testing';
import { EventsAnnouncementsService } from '../core/events-announcements.service';

describe('EventsAnnouncementsService', () => {
  let service: EventsAnnouncementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsAnnouncementsService],
    }).compile();

    service = module.get<EventsAnnouncementsService>(EventsAnnouncementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
