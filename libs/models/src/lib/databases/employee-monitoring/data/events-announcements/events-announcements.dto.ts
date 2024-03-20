import { EventsAnnouncementsStatus } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, IsUrl } from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateEventsAnnouncementsDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsEnum(EventsAnnouncementsStatus)
  status: EventsAnnouncementsStatus;

  @IsDateString()
  eventAnnouncementDate: Date;

  @IsString()
  fileName: string;
}

export class UpdateEventsAnnouncementsDto extends PartialType(CreateEventsAnnouncementsDto) {
  @IsUUID()
  id: string;
}
