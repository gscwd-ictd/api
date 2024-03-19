import { Test, TestingModule } from '@nestjs/testing';
import { EventsAnnouncementsController } from '../core/events-announcements.controller';

describe('EventsAnnouncementsController', () => {
  let controller: EventsAnnouncementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsAnnouncementsController],
    }).compile();

    controller = module.get<EventsAnnouncementsController>(EventsAnnouncementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
