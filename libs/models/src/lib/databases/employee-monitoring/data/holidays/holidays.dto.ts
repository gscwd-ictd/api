import { HolidayType } from '@gscwd-api/utils';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class HolidaysDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(HolidayType)
  type: HolidayType;

  @IsDate()
  holidayDate: Date;
}

export class UpdateHolidayDto extends PartialType(HolidaysDto) {
  id: string;
}
