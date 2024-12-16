import { Controller, UseFilters } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { MsExceptionFilter } from '@gscwd-api/utils';

@Controller()
export class EventsAnnouncementsMsController {
  constructor(private readonly eventsAnnouncementService: EventsAnnouncementsService) { }

  @UseFilters(new MsExceptionFilter())
  @MessagePattern('get_events_announcements')
  async getEventsAnnouncements() {
    try {
      return await this.eventsAnnouncementService.getEventsAnnouncements();
    }
    catch (error) {
      throw new RpcException(error.message);
    }
  }
}
