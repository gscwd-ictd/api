import { PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ProjectDetails } from '../project-details';

export class CreateContingencyDto {
  @IsUUID(4, { message: 'project details id is not valid' })
  projectDetails: ProjectDetails;
}

export class UpdateContingencyDto extends PartialType(CreateContingencyDto) {}
