import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf((obj) => !obj.email)
  @IsNotEmpty()
  name: string;

  @ValidateIf((obj) => !obj.name)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
