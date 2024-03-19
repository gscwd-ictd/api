import { EventsAnnouncementsStatus } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString, IsUUID, IsUrl } from 'class-validator';

export class CreateEventsAnnouncementsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;

  @IsUrl()
  photoUrl: string;

  @IsEnum(EventsAnnouncementsStatus)
  status: EventsAnnouncementsStatus;

  @IsDate()
  eventAnnouncementDate: Date;
}

export class UpdateEventsAnnouncementsDto extends PartialType(CreateEventsAnnouncementsDto) {
  @IsUUID()
  id: string;
}
