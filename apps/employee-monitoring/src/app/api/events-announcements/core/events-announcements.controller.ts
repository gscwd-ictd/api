import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { CreateAccountGroupDto } from '@gscwd-api/models';

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

  @Post()
  async addEventAnnouncement(@Body() eventAnnouncementDto: CreateAccountGroupDto) {}
}
