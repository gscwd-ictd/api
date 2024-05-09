import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { CreateEventsAnnouncementsDto, UpdateEventsAnnouncementsDto } from '@gscwd-api/models';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ version: '1', path: 'events-announcements' })
export class EventsAnnouncementsController {
  constructor(private readonly eventsAnnounceService: EventsAnnouncementsService) {}

  @Get()
  async getEventsAnnouncements() {
    return await this.eventsAnnounceService.getEventsAnnouncementsForEms();
  }

  @Delete(':event_announcement_id')
  async deleteEventAnnouncement(@Param('event_announcement_id') id: string) {
    return await this.eventsAnnounceService.deleteEventAnnouncement(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addEventAnnouncement(@Body() eventAnnouncementDto: CreateEventsAnnouncementsDto, @UploadedFile() file: any) {
    await this.eventsAnnounceService.addEventAnnouncementFromFileBuffer(eventAnnouncementDto, file);
    return { ...eventAnnouncementDto, file };
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateEventAnnouncement(@Body() updateEventsAnnouncementsDto: UpdateEventsAnnouncementsDto, @UploadedFile() file: any) {
    return await this.eventsAnnounceService.updateEventAnnouncement(updateEventsAnnouncementsDto, file);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: any, @Body() eventAnnouncementDto: CreateEventsAnnouncementsDto) {}
}
