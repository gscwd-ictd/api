import { Controller } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class EventsAnnouncementsMsController {
  constructor(private readonly eventsAnnouncementService: EventsAnnouncementsService) {}

  @MessagePattern('get_events_announcements')
  async getEventsAnnouncements() {
    return await this.eventsAnnouncementService.getEventsAnnouncements();
  }
}
