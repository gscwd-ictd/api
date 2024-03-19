import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateAccountGroupDto, EventsAnnouncements } from '@gscwd-api/models';
import { EventsAnnouncementsStatus } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class EventsAnnouncementsService extends CrudHelper<EventsAnnouncements> {
  constructor(private readonly crudService: CrudService<EventsAnnouncements>) {
    super(crudService);
  }

  async getEventsAnnouncements() {
    return await this.crudService.findAll({
      find: { order: { eventAnnouncementDate: 'DESC' }, where: { status: EventsAnnouncementsStatus.ACTIVE } },
    });
  }

  async deleteEventAnnouncement(id: string) {
    const eventAnnouncement = await this.crudService.findOne({ find: { where: { id } }, onError: () => new NotFoundException() });
    if (eventAnnouncement) {
      const result = await this.crudService.delete({ deleteBy: { id }, onError: () => new InternalServerErrorException() });
      if (result.affected > 0) return eventAnnouncement;
    }
    throw new InternalServerErrorException();
  }

  async addEventAnnouncement(eventAnnouncementDto: CreateAccountGroupDto) {
    //return await this.crudService.create({dto: eventAnnouncementDto,})
  }
}
