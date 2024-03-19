import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { EventsAnnouncements } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsAnnouncementsService extends CrudHelper<EventsAnnouncements> {
  constructor(private readonly crudService: CrudService<EventsAnnouncements>) {
    super(crudService);
  }

  async getEventsAnnouncements() {
    return await this.crudService.findAll({ find: { order: { eventAnnouncementDate: 'DESC' } } });
  }
}
