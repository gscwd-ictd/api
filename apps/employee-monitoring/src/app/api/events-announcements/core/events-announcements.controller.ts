import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';

@Controller({ version: '1', path: 'events-announcements' })
export class EventsAnnouncementsController {
  constructor(private readonly eventsAnnounceService: EventsAnnouncementsService) {}

  @Get()
  async getEventsAnnouncements() {
    return await this.eventsAnnounceService.getEventsAnnouncements();
  }

  @Delete(':event_announcement_id')
  async deleteEventAnnouncement(@Param('event_announcement_id') id: string) {
    return await this.eventsAnnounceService.deleteEventAnnouncement(id);
  }
}
