import { PartialType } from '@nestjs/swagger';

export class CreateCustomGroupsDto {
  name: string;
  description: string;
}

export class UpdateCustomGroupsDto extends PartialType(CreateCustomGroupsDto) {
  id: string;
}
