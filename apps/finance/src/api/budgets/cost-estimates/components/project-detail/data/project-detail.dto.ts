import { PartialType } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateProjectDetailDto {
  @IsString()
  @MaxLength(50, { message: 'Project name name is too long.' })
  projectName: string;

  @IsString()
  location: string;

  @IsString()
  itemNumber: string;

  @IsString()
  workDescription: string;

  @IsInt()
  quantity: number;

  @IsInt()
  outputPerDay: number;
}

export class UpdateProjectDetailDto extends PartialType(CreateProjectDetailDto) {}
