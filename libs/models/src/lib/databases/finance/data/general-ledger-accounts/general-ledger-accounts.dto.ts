import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { GeneralLedgerContraAccountType } from '../general-ledger-contra-account-types';
import { SubMajorAccountGroup } from '../sub-major-account-groups';

export class CreateGeneralLedgerAccountDto {
  @IsUUID(4, { message: 'sub major account group id is not valid' })
  subMajorAccountGroup: SubMajorAccountGroup;

  @IsUUID(4, { message: 'general ledger contra account type id is not valid' })
  generalLedgerContraAccountType: GeneralLedgerContraAccountType;

  @IsString({ message: 'general ledger account code must be a string' })
  @Length(2, 2, { message: 'major account group code must be 2 characters long' })
  code: string;

  @IsString({ message: 'general ledger account name must be a string' })
  @Length(1, 50, { message: 'major account group name must be between 1 to 50 characters' })
  name: string;

  @IsOptional()
  @IsString({ message: 'general ledger account description must be a string' })
  description: string;
}

export class UpdateGeneralLedgerAccountDto extends PartialType(CreateGeneralLedgerAccountDto) {}
