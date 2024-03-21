import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { CreateEventsAnnouncementsDto, UpdateEventsAnnouncementsDto } from '@gscwd-api/models';

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
  async addEventAnnouncement(@Body() eventAnnouncementDto: CreateEventsAnnouncementsDto) {
    return await this.eventsAnnounceService.addEventAnnouncement(eventAnnouncementDto);
  }

  @Put()
  async updateEventAnnouncement(@Body() updateEventsAnnouncementsDto: UpdateEventsAnnouncementsDto) {
    return await this.eventsAnnounceService.updateEventAnnouncement(updateEventsAnnouncementsDto);
  }
}
