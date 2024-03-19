import { Module } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { EventsAnnouncementsController } from './events-announcements.controller';
import { EventsAnnouncementsMsController } from './events-announcements-ms.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EventsAnnouncements } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(EventsAnnouncements)],
  providers: [EventsAnnouncementsService],
  controllers: [EventsAnnouncementsController, EventsAnnouncementsMsController],
  exports: [EventsAnnouncementsService],
})
export class EventsAnnouncementsModule {}
