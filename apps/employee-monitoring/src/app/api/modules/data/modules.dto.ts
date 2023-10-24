import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateModuleDto {
  module: string;
  slug: string;
  url: string;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {
  id: string;
}
