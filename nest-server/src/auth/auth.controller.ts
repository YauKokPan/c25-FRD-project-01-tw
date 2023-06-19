import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { LoginDto, CreateUserDto } from './dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  login(@Req() req: Request, @Body() loginDto: LoginDto) {
    return this.authService.login(req, loginDto);
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
