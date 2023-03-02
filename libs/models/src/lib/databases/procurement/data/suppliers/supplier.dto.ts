import { PartialType } from '@nestjs/swagger';
import { IsBoolean, isBoolean, IsEmail, IsString, isString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  supplier_name: string;

  @IsString()
  supplier_address: string;

  @IsString()
  cellphone_number: string;

  @IsString()
  telephone_number: string;

  @IsEmail()
  email_address: string;

  @IsString()
  TIN_no: string;

  @IsString()
  remarks: string;

  @IsBoolean()
  isVatable: boolean;
}
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
