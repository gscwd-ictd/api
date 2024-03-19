import { Controller, Get } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';

@Controller({ version: '1', path: 'events-announcements' })
export class EventsAnnouncementsController {
  constructor(private readonly eventsAnnounceService: EventsAnnouncementsService) {}

  @Get()
  async getEventsAnnouncements() {}
}
