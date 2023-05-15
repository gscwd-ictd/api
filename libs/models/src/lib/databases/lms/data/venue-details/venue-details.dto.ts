import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateVenueDetailsDto {
  @IsString({ message: 'venue details name must be a string' })
  @IsNotEmpty({ message: 'venue details name is required' })
  @Length(1, 50, { message: 'venue details name must be between 1 to 50 characters' })
  name: string;

  @IsString({ message: 'venue details address must be a string' })
  @IsNotEmpty({ message: 'venue details address is required' })
  @Length(1, 100, { message: 'venue details address must be between 1 to 100 characters' })
  address: string;

  @IsString({ message: 'venue details contact number must be a string' })
  @IsNotEmpty({ message: 'venue details contact number is required' })
  @Length(1, 11, { message: 'venue details contact number must be between 1 to 11 characters' })
  contactNumber: string;

  @IsString({ message: 'venue details contact person must be a string' })
  @IsNotEmpty({ message: 'venue details contact person is required' })
  @Length(1, 100, { message: 'venue details contact person must be between 1 to 100 characters' })
  contactPerson: string;

  @IsEmail()
  @IsNotEmpty({ message: 'venue details email is  required' })
  email: string;
}

export class UpdateVenueDetailsDto extends PartialType(CreateVenueDetailsDto) {}
