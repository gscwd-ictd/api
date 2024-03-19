import { DatabaseEntity, IEntity } from '@gscwd-api/crud';
import { EventsAnnouncementsStatus } from '@gscwd-api/utils';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'events_announcements' })
export class EventsAnnouncements extends DatabaseEntity implements IEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'events_announcements_id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'url', type: 'text' })
  url: string;

  @Column({ name: 'photo_url', type: 'text' })
  photoUrl: string;

  @Column({ name: 'status', type: 'enum', enum: EventsAnnouncementsStatus, default: EventsAnnouncementsStatus.ACTIVE })
  status: EventsAnnouncementsStatus;

  @Column({ name: 'event_announcement_date' })
  eventAnnouncementDate: Date;
}
