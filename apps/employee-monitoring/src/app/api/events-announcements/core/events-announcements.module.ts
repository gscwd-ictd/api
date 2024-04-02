import { Module } from '@nestjs/common';
import { EventsAnnouncementsService } from './events-announcements.service';
import { EventsAnnouncementsController } from './events-announcements.controller';
import { EventsAnnouncementsMsController } from './events-announcements-ms.controller';
import { CrudModule } from '@gscwd-api/crud';
import { EventsAnnouncements } from '@gscwd-api/models';
import { AppwriteModule } from '../../appwrite/core/appwrite.module';

@Module({
  imports: [CrudModule.register(EventsAnnouncements), AppwriteModule],
  providers: [EventsAnnouncementsService],
  controllers: [EventsAnnouncementsController, EventsAnnouncementsMsController],
  exports: [EventsAnnouncementsService],
})
export class EventsAnnouncementsModule {}
