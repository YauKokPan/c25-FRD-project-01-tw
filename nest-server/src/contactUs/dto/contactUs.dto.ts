import { IsEmail, IsNotEmpty } from 'class-validator';

export class ContactUsDto {
  @IsNotEmpty()
  contact_name: string;

  @IsEmail()
  @IsNotEmpty()
  contact_email: string;

  @IsNotEmpty()
  contact_phone: string;

  @IsNotEmpty()
  contact_message: string;
}
