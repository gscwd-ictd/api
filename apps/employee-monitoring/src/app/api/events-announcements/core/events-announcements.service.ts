import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateEventsAnnouncementsDto, EventsAnnouncements, UpdateEventsAnnouncementsDto } from '@gscwd-api/models';
import { EventsAnnouncementsStatus } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AppwriteService } from '../../appwrite/core/appwrite.service';

@Injectable()
export class EventsAnnouncementsService extends CrudHelper<EventsAnnouncements> {
  constructor(private readonly crudService: CrudService<EventsAnnouncements>, private readonly appwriteService: AppwriteService) {
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
      const result = await this.crudService.delete({ deleteBy: { id }, softDelete: false, onError: () => new InternalServerErrorException() });
      if (result.affected > 0) {
        const deleteResult = await this.appwriteService.deleteFile(id);
        console.log(deleteResult);
        return eventAnnouncement;
      }
    }
    throw new InternalServerErrorException();
  }

  async addEventAnnouncement(eventAnnouncementDto: CreateEventsAnnouncementsDto) {
    const { photoUrl, fileName, ...restOfEventAnnouncements } = eventAnnouncementDto;
    const eventAnnouncement = await this.crudService.create({
      dto: { photoUrl: null, ...restOfEventAnnouncements },
      onError: () => new InternalServerErrorException(),
    });
    const file = await this.appwriteService.createFile(photoUrl, fileName, eventAnnouncement.id);
    const photo_url = await this.appwriteService.getFileUrl(file.$id);
    const updateResult = await this.crudService.update({
      dto: { photoUrl: photo_url },
      updateBy: { id: eventAnnouncement.id },
    });

    return {
      ...eventAnnouncement,
      photoUrl: photo_url,
    };
  }

  async updateEventAnnouncement(updateEventsAnnouncementsDto: UpdateEventsAnnouncementsDto) {
    const { id, photoUrl, fileName, ...restOfEventsAnnouncements } = updateEventsAnnouncementsDto;
    let photo_url;
    if (photoUrl !== null) {
      const deleteResult = await this.appwriteService.deleteFile(id);
      const file = await this.appwriteService.createFile(photoUrl, fileName, id);
      photo_url = await this.appwriteService.getFileUrl(file.$id);
    }
    const updateResult = await this.crudService.update({ dto: { ...restOfEventsAnnouncements, photoUrl: photo_url }, updateBy: { id } });
    if (updateResult.affected > 0) return { id, ...restOfEventsAnnouncements, photoUrl: photo_url };
  }
}
