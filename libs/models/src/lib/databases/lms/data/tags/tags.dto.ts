import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class TagDto {
  @IsNotEmpty()
  @IsUUID('4')
  id: string;
}

export class CreateTagDto {
  @IsString({ message: 'tag name must be a string' })
  @Length(1, 50, { message: 'tag name must be between 1 to 50 characters' })
  @IsNotEmpty()
  name: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
