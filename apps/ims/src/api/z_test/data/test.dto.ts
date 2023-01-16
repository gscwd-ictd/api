import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  age: number;

  @IsDate()
  @Type(() => Date)
  birthdate: Date;
}
