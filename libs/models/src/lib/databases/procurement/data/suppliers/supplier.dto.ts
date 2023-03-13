import { PartialType } from '@nestjs/swagger';
import { IsBoolean, isBoolean, IsEmail, IsEnum, IsOptional, IsString, isString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  mobileNumber: string;

  @IsString()
  telNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  tin: string;

  @IsString()
  remarks: string;

  @IsBoolean()
  @IsOptional()
  isVatable?: boolean;
}
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
