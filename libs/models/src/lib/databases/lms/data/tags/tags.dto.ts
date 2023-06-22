import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'tag description must be a string' })
  @Length(1, 50, { message: 'tag description must be between 1 to 50 characters' })
  @IsNotEmpty()
  description: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
